/**
 * File store emulator connector class.
 *
 * TODO: Consider Cloudflare R2 Download URL: https://plugins-eu.datapositioning.app/connectors/datapos-connector-file-store-emulator-es.js.
 * This would allow us to secure the bucket?
 */

/** Dependencies - Vendor. */
import { nanoid } from 'nanoid';

/** Dependencies - Framework. */
import type { Tool as CSVParseTool } from '@datapos/datapos-tool-csv-parse';
import { loadTool } from '@datapos/datapos-shared/component/tool';
import type { ToolConfig } from '@datapos/datapos-shared/component/tool';
import { buildFetchError, normalizeToError, OperationalError } from '@datapos/datapos-shared/errors';
import type {
    ConnectionConfig,
    ConnectionNodeConfig,
    ConnectorConfig,
    ConnectorInterface,
    FindObjectFolderPathSettings,
    GetReadableStreamSettings,
    ListResult,
    ListSettings,
    PreviewResult,
    PreviewSettings,
    RetrieveRecordsSettings,
    RetrieveRecordsSummary
} from '@datapos/datapos-shared/component/connector';
import { extractExtensionFromPath, extractNameFromPath, lookupMimeTypeForExtension } from '@datapos/datapos-shared/utilities';

/** Data dependencies. */
import config from '~/config.json';
import fileStoreFolderPathData from '@/fileStoreFolderPaths.json';
import { version } from '~/package.json';
import { addNumbersWithRust, checksumWithRust } from '@/rustBridge';

/** File store folder paths. */
type FileStoreFolderNode =
    | ({ typeId: 'folder'; childCount: number } & { name: string })
    | ({ typeId: 'object'; id: string; lastModifiedAt: number; size: number } & { name: string });
type FileStoreFolderPaths = Record<string, FileStoreFolderNode[]>;

/** Constants */
const CALLBACK_PREVIEW_ABORTED = 'Connector failed to abort preview object operation.';
const CALLBACK_RETRIEVE_ABORTED = 'Connector failed to abort retrieve all records operation.';
const DEFAULT_PREVIEW_CHUNK_SIZE = 4096;
const DEFAULT_RETRIEVE_CHUNK_SIZE = 1000;
const URL_PREFIX = 'https://sample-data-eu.datapos.app';

/** File store emulator connector. */
export default class FileStoreEmulatorConnector implements ConnectorInterface {
    abortController: AbortController | undefined;
    readonly config: ConnectorConfig;
    readonly connectionConfig: ConnectionConfig;
    readonly toolConfigs;

    constructor(connectionConfig: ConnectionConfig, toolConfigs: ToolConfig[]) {
        this.abortController = undefined;
        this.config = config as ConnectorConfig;
        this.config.version = version;
        this.connectionConfig = connectionConfig;
        this.toolConfigs = toolConfigs;
    }

    /** Abort the currently running operation. */
    abortOperation(connector: ConnectorInterface): void {
        if (!connector.abortController) return;
        connector.abortController.abort();
        connector.abortController = undefined;
    }

    /** Find the folder path containing the specified object node. */
    findObjectFolderPath(connector: ConnectorInterface, settings: FindObjectFolderPathSettings): Promise<string | null> {
        const fileStoreFolderPaths = fileStoreFolderPathData as FileStoreFolderPaths;
        // Loop through the folder path data checking for an object entry with an identifier equal to the object name.
        for (const folderPath in fileStoreFolderPaths) {
            if (Object.prototype.hasOwnProperty.call(fileStoreFolderPaths, folderPath)) {
                // eslint-disable-next-line security/detect-object-injection
                const folderPathNodes = fileStoreFolderPaths[folderPath];
                const folderPathNode = folderPathNodes?.find((folderPathNode) => folderPathNode.typeId === 'object' && folderPathNode.id === settings.nodeId);
                if (folderPathNode) return Promise.resolve(folderPath); // Found, return folder path.
            }
        }
        return Promise.resolve(null); // Not found.
    }

    /** Get a readable stream for the specified object node path. */
    async getReadableStream(connector: ConnectorInterface, settings: GetReadableStreamSettings): Promise<ReadableStream> {
        try {
            const response = await fetch(`${URL_PREFIX}/fileStore${settings.path}`);
            if (response.body == null) throw new Error('Readable streams not supported by this browser.');

            // TODO: Remove after testing.
            const xxx = await addNumbersWithRust(12, 56);
            const sum = await checksumWithRust(connector.config.version);
            console.log('sum', sum, xxx);

            return await Promise.resolve(response.body);
        } catch (error) {
            connector.abortController = undefined;
            throw error;
        }
    }

    /** Lists all nodes (folders and objects) in the specified folder path. */
    listNodes(connector: ConnectorInterface, settings: ListSettings): Promise<ListResult> {
        const fileStoreFolderPaths = fileStoreFolderPathData as FileStoreFolderPaths;
        const folderNodes = fileStoreFolderPaths[settings.folderPath] ?? [];
        const connectionNodeConfigs: ConnectionNodeConfig[] = [];
        for (const folderNode of folderNodes) {
            if (folderNode.typeId === 'folder') {
                connectionNodeConfigs.push(this.constructFolderNodeConfig(settings.folderPath, folderNode.name, folderNode.childCount));
            } else {
                connectionNodeConfigs.push(this.constructObjectNodeConfig(settings.folderPath, folderNode.id, folderNode.name, folderNode.lastModifiedAt, folderNode.size));
            }
        }
        return Promise.resolve({ cursor: undefined, isMore: false, connectionNodeConfigs, totalCount: connectionNodeConfigs.length });
    }

    /** Preview the contents of the object node with the specified path. */
    async previewObject(connector: ConnectorInterface, settings: PreviewSettings): Promise<PreviewResult> {
        try {
            // Create an abort controller. Get the signal for the abort controller and add an abort listener.
            connector.abortController = new AbortController();
            const signal = connector.abortController.signal;
            signal.addEventListener('abort', () => {
                throw new OperationalError(CALLBACK_PREVIEW_ABORTED, 'datapos-connector-file-store-emulator|Connector|preview.abort');
            });

            // Fetch chunk from start of file.
            const url = `${URL_PREFIX}/fileStore${settings.path}`;
            const chunkSize = settings.chunkSize ?? DEFAULT_PREVIEW_CHUNK_SIZE;
            const headers: HeadersInit = { Range: `bytes=0-${chunkSize}` };
            const response = await fetch(encodeURI(url), { headers, signal });
            if (response.ok) {
                connector.abortController = undefined;
                return { data: new Uint8Array(await response.arrayBuffer()), typeId: 'uint8Array' };
            } else {
                throw await buildFetchError(response, `Failed to fetch '${settings.path}' file.`, 'datapos-connector-file-store-emulator|Connector|preview');
            }
        } catch (error) {
            connector.abortController = undefined;
            throw error;
        }
    }

    /** Retrieves all records from a CSV object node using streaming and chunked processing. */
    async retrieveRecords(
        connector: ConnectorInterface,
        settings: RetrieveRecordsSettings,
        chunk: (records: string[][]) => void,
        complete: (result: RetrieveRecordsSummary) => void
    ): Promise<void> {
        const csvParseTool = await loadTool<CSVParseTool>(connector.toolConfigs, 'csv-parse');
        return new Promise((resolve, reject) => {
            try {
                // Create an abort controller and get the signal. Add an abort listener to the signal.
                connector.abortController = new AbortController();
                const signal = connector.abortController.signal;
                signal.addEventListener(
                    'abort',
                    () => {
                        connector.abortController = undefined;
                        reject(new OperationalError(CALLBACK_RETRIEVE_ABORTED, 'datapos-connector-file-store-emulator|Connector|retrieve.abort'));
                    },
                    { once: true }
                );

                // Parser - Declare variables.
                let pendingRows: string[][] = []; // Array to store rows of parsed field values and associated information.

                // Parser - Create a parser object for CSV parsing.
                const parser = csvParseTool.buildParser({
                    delimiter: settings.valueDelimiterId,
                    info: true,
                    relax_column_count: true,
                    relax_quotes: true
                });

                // Parser - Event listener for the 'readable' (data available) event.
                parser.on('readable', () => {
                    try {
                        let data: string[] | null;
                        while ((data = parser.read() as string[] | null) !== null) {
                            signal.throwIfAborted(); // Check if the abort signal has been triggered.
                            pendingRows.push(data); // Append the row of parsed values and associated information to the pending rows array.
                            if (pendingRows.length < DEFAULT_RETRIEVE_CHUNK_SIZE) continue; // Continue with next iteration if the pending rows array is not yet full.
                            chunk(pendingRows); // Pass the pending rows to the engine using the 'chunk' callback.
                            pendingRows = []; // Clear the pending rows array in preparation for the next batch of data.
                        }
                    } catch (error) {
                        connector.abortController = undefined;
                        reject(normalizeToError(error));
                    }
                });

                // Parser - Event listener for the 'error' event.
                parser.on('error', (error) => {
                    connector.abortController = undefined;
                    reject(normalizeToError(error));
                });

                // Parser - Event listener for the 'end' (end of data) event.
                parser.on('end', () => {
                    try {
                        signal.throwIfAborted(); // Check if the abort signal has been triggered.
                        connector.abortController = undefined; // Clear the abort controller.
                        if (pendingRows.length > 0) {
                            chunk(pendingRows);
                            pendingRows = [];
                        }
                        complete({
                            byteCount: parser.info.bytes,
                            commentLineCount: parser.info.comment_lines,
                            emptyLineCount: parser.info.empty_lines,
                            invalidFieldLengthCount: parser.info.invalid_field_length,
                            lineCount: parser.info.lines,
                            recordCount: parser.info.records
                        });
                        resolve();
                    } catch (error) {
                        connector.abortController = undefined;
                        reject(normalizeToError(error));
                    }
                });

                // Fetch, decode and forward the contents of the file to the parser.
                const url = `${URL_PREFIX}/fileStore${settings.path}`;
                fetch(encodeURI(url), { signal })
                    .then(async (response) => {
                        try {
                            if (response.ok && response.body) {
                                const stream = response.body.pipeThrough(new TextDecoderStream(settings.encodingId));
                                const decodedStreamReader = stream.getReader();
                                let result = await decodedStreamReader.read();
                                while (!result.done) {
                                    signal.throwIfAborted(); // Check if the abort signal has been triggered.
                                    // Write the decoded data to the parser and terminate if there is an error.
                                    parser.write(result.value, (error) => {
                                        if (error) {
                                            connector.abortController = undefined;
                                            reject(normalizeToError(error));
                                        }
                                    });
                                    result = await decodedStreamReader.read();
                                }
                                parser.end(); // Signal no more data will be written.
                            } else {
                                const error = await buildFetchError(
                                    response,
                                    `Failed to fetch '${settings.path}' file.`,
                                    'datapos-connector-file-store-emulator|Connector|retrieve'
                                );
                                connector.abortController = undefined;
                                reject(error);
                            }
                        } catch (error) {
                            connector.abortController = undefined;
                            reject(normalizeToError(error));
                        }
                    })
                    .catch((error: unknown) => {
                        connector.abortController = undefined;
                        reject(normalizeToError(error));
                    });
            } catch (error) {
                connector.abortController = undefined;
                reject(normalizeToError(error));
            }
        });
    }

    /** Construct folder node configuration. */
    private constructFolderNodeConfig(folderPath: string, name: string, childCount: number): ConnectionNodeConfig {
        return { id: nanoid(), childCount, extension: undefined, folderPath, label: name, name, typeId: 'folder' };
    }

    /** Construct object (file) node configuration. */
    private constructObjectNodeConfig(folderPath: string, id: string, fullName: string, lastModifiedAt: number, size: number): ConnectionNodeConfig {
        const name = extractNameFromPath(fullName) ?? '';
        const extension = extractExtensionFromPath(fullName);
        const lastModifiedAtTimestamp = lastModifiedAt;
        const mimeType = lookupMimeTypeForExtension(extension);
        return { id, extension, folderPath, label: fullName, lastModifiedAt: lastModifiedAtTimestamp, mimeType, name, size, typeId: 'object' };
    }
}
