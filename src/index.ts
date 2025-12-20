/*
 * File store emulator connector class.
 */

// NOTE: Consider Cloudflare R2 Download URL: https://plugins-eu.datapositioning.app/connectors/datapos-connector-file-store-emulator-es.js. This would allow us to secure the bucket?

// Dependencies - Vendor.
import type { HeadersInit } from 'undici';

/** Dependencies - Framework. */
import { normalizeToError } from '@datapos/datapos-shared';
import type {
    ConnectionConfig,
    ConnectionNodeConfig,
    Connector,
    ConnectorConfig,
    ConnectorTools,
    FindResult,
    FindSettings,
    GetReaderResult,
    GetReaderSettings,
    ListResult,
    ListSettings,
    PreviewResult,
    PreviewSettings,
    RetrieveSettings,
    RetrieveSummary
} from '@datapos/datapos-shared';

/** Dependencies - Data. */
import config from '~/config.json';
import fileStoreIndex from '@/fileStoreIndex.json';
import { version } from '~/package.json';
import { addNumbersWithRust, checksumWithRust } from '@/rustBridge';

/** Interfaces/Types - File store index. */
type FileStoreIndexItem =
    | ({ typeId: 'folder'; childCount: number } & { name: string })
    | ({ typeId: 'object'; id: string; lastModifiedAt: number; size: number } & { name: string });
type FileStoreIndex = Record<string, FileStoreIndexItem[]>;

/** Constants */
const CALLBACK_PREVIEW_ABORTED = 'Connector failed to abort preview object operation.';
const CALLBACK_RETRIEVE_ABORTED = 'Connector failed to abort retrieve all records operation.';
const DEFAULT_PREVIEW_CHUNK_SIZE = 4096;
const DEFAULT_RETRIEVE_CHUNK_SIZE = 1000;
const URL_PREFIX = 'https://sample-data-eu.datapos.app';

/** Classes - File store emulator connector. */
export default class FileStoreEmulatorConnector implements Connector {
    abortController: AbortController | undefined;
    readonly config: ConnectorConfig;
    readonly connectionConfig: ConnectionConfig;
    readonly tools: ConnectorTools;

    constructor(connectionConfig: ConnectionConfig, tools: ConnectorTools) {
        this.abortController = undefined;
        this.config = config as ConnectorConfig;
        this.config.version = version;
        this.connectionConfig = connectionConfig;
        this.tools = tools;
    }

    // Operations - Abort operation.
    abortOperation(connector: FileStoreEmulatorConnector): void {
        if (!connector.abortController) return;
        connector.abortController.abort();
        connector.abortController = undefined;
    }

    // Operations - Find object.
    findObject(connector: FileStoreEmulatorConnector, settings: FindSettings): Promise<FindResult> {
        // Loop through the file store index checking for an object entry with an identifier equal to the object name.
        for (const folderPath in fileStoreIndex) {
            if (Object.prototype.hasOwnProperty.call(fileStoreIndex, folderPath)) {
                // eslint-disable-next-line security/detect-object-injection
                const indexItems = (fileStoreIndex as FileStoreIndex)[folderPath];
                const indexItem = indexItems?.find((indexItem) => indexItem.typeId === 'object' && indexItem.id === settings.objectName);
                if (indexItem) return Promise.resolve({ folderPath }); // Found, return folder path.
            }
        }
        return Promise.resolve({}); // Not found, return undefined folder path.
    }

    // Operations - Get reader.
    async getReader(connector: FileStoreEmulatorConnector, settings: GetReaderSettings): Promise<GetReaderResult> {
        try {
            console.log('getReader', 'connector', connector);
            console.log('getReader', 'settings', settings);
            const response = await fetch('https://sample-data-eu.datapos.app/fileStore/ENGAGEMENT_START_EVENTS_202405121858.csv');
            // const response = await fetch('https://sample-data-eu.datapos.app/WDI_Data.csv');
            console.log('getReader', 'response', response);
            if (!response.body) throw new Error('ReadableStream not supported by this browser.');

            await addNumbersWithRust(12, 56);
            const sum = await checksumWithRust(connector.config.version);
            console.log('sum', sum);

            return await Promise.resolve({ readable: response.body }); // Not found, return undefined folder path.
        } catch (error) {
            connector.abortController = undefined;
            throw error;
        }
    }

    // Operations - List nodes.
    listNodes(connector: FileStoreEmulatorConnector, settings: ListSettings): Promise<ListResult> {
        const indexItems = (fileStoreIndex as FileStoreIndex)[settings.folderPath] ?? [];
        const connectionNodeConfigs: ConnectionNodeConfig[] = [];
        for (const indexItem of indexItems) {
            if (indexItem.typeId === 'folder') {
                connectionNodeConfigs.push(this.constructFolderNodeConfig(settings.folderPath, indexItem.name, indexItem.childCount));
            } else {
                connectionNodeConfigs.push(this.constructObjectNodeConfig(settings.folderPath, indexItem.id, indexItem.name, indexItem.lastModifiedAt, indexItem.size));
            }
        }
        return Promise.resolve({ cursor: undefined, isMore: false, connectionNodeConfigs, totalCount: connectionNodeConfigs.length });
    }

    // Operations - Preview object.
    async previewObject(connector: FileStoreEmulatorConnector, settings: PreviewSettings): Promise<PreviewResult> {
        try {
            // Create an abort controller. Get the signal for the abort controller and add an abort listener.
            connector.abortController = new AbortController();
            const signal = connector.abortController.signal;
            signal.addEventListener('abort', () => {
                throw new this.tools.dataPos.OperationalError(CALLBACK_PREVIEW_ABORTED, 'datapos-connector-file-store-emulator|Connector|preview.abort');
            });

            // Fetch chunk from start of file.
            const url = `${URL_PREFIX}/fileStore${settings.path}`;
            const headers: HeadersInit = { Range: `bytes=0-${settings.chunkSize != null || DEFAULT_PREVIEW_CHUNK_SIZE}` };
            const response = await fetch(encodeURI(url), { headers, signal });
            if (response.ok) {
                connector.abortController = undefined;
                return { data: new Uint8Array(await response.arrayBuffer()), typeId: 'uint8Array' };
            } else {
                throw await this.tools.dataPos.buildFetchError(response, `Failed to fetch '${settings.path}' file.`, 'datapos-connector-file-store-emulator|Connector|preview');
            }
        } catch (error) {
            connector.abortController = undefined;
            throw error;
        }
    }

    // Operations - Retrieve records.
    async retrieveRecords(
        connector: FileStoreEmulatorConnector,
        settings: RetrieveSettings,
        chunk: (records: string[][]) => void,
        complete: (result: RetrieveSummary) => void
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                // Create an abort controller and get the signal. Add an abort listener to the signal.
                connector.abortController = new AbortController();
                const signal = connector.abortController.signal;
                signal.addEventListener(
                    'abort',
                    () => {
                        connector.abortController = undefined;
                        reject(new connector.tools.dataPos.OperationalError(CALLBACK_RETRIEVE_ABORTED, 'datapos-connector-file-store-emulator|Connector|retrieve.abort'));
                    },
                    { once: true }
                );

                // Parser - Declare variables.
                let pendingRows: string[][] = []; // Array to store rows of parsed field values and associated information.

                // Parser - Create a parser object for CSV parsing.
                const parser = connector.tools.csvParse({
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
                            chunk([]); // Pass the pending rows to the engine using the 'chunk' callback.
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
                            chunk([]);
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
                                const error = await connector.tools.dataPos.buildFetchError(
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

    /** Utilities - Construct folder node configuration. */
    private constructFolderNodeConfig(folderPath: string, name: string, childCount: number): ConnectionNodeConfig {
        return { id: this.tools.nanoid(), childCount, folderPath, label: name, name, typeId: 'folder' };
    }

    /** Utilities - Construct object (file) node configuration. */
    private constructObjectNodeConfig(folderPath: string, id: string, fullName: string, lastModifiedAt: number, size: number): ConnectionNodeConfig {
        const name = this.tools.dataPos.extractNameFromPath(fullName) ?? '';
        const extension = this.tools.dataPos.extractExtensionFromPath(fullName);
        const lastModifiedAtTimestamp = lastModifiedAt;
        const mimeType = this.tools.dataPos.lookupMimeTypeForExtension(extension);
        return { id, extension, folderPath, label: fullName, lastModifiedAt: lastModifiedAtTimestamp, mimeType, name, size, typeId: 'object' };
    }
}
