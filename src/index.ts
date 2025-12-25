/**
 * File store emulator connector class.
 *
 * TODO: Consider Cloudflare R2 Download URL: https://plugins-eu.datapositioning.app/connectors/datapos-connector-file-store-emulator-es.js.
 * This would allow us to secure the bucket?
 */

/** Dependencies - Vendor. */
import { nanoid } from 'nanoid';

/** Dependencies - Framework. */
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
    ListNodesResult,
    ListNodesSettings,
    PreviewObjectResult,
    PreviewObjectSettings,
    RetrieveRecordsSettings,
    RetrieveRecordsSummary
} from '@datapos/datapos-shared/component/connector';
import type { Tool as CSVParseTool, Parser } from '@datapos/datapos-tool-csv-parse';
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

interface RowBuffer {
    push: (row: string[]) => void;
    flush: () => void;
}

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
            if (Object.hasOwn(fileStoreFolderPaths, folderPath)) {
                // eslint-disable-next-line security/detect-object-injection
                const folderPathNodes = fileStoreFolderPaths[folderPath];
                const folderPathNode = folderPathNodes?.find((folderPathNode) => folderPathNode.typeId === 'object' && folderPathNode.id === settings.nodeId);
                if (folderPathNode) return Promise.resolve(folderPath); // Found, return folder path.
            }
        }
        return Promise.resolve(null); // Not found.
    }

    /** Get a readable stream for the specified object node path. */
    async getReadableStream(connector: ConnectorInterface, settings: GetReadableStreamSettings): Promise<ReadableStream<Uint8Array<ArrayBuffer>>> {
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
    listNodes(connector: ConnectorInterface, settings: ListNodesSettings): Promise<ListNodesResult> {
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
    async previewObject(connector: ConnectorInterface, settings: PreviewObjectSettings): Promise<PreviewObjectResult> {
        try {
            // Create an abort controller. Get the signal for the abort controller and add an abort listener.
            connector.abortController = new AbortController();
            const signal = connector.abortController.signal;
            signal.addEventListener('abort', () => {
                throw new OperationalError(CALLBACK_PREVIEW_ABORTED, 'datapos-connector-file-store-emulator|Connector|preview.abort');
            });

            // Fetch chunk from start of file.
            const headers: HeadersInit = { Range: `bytes=0-${settings.chunkSize ?? DEFAULT_PREVIEW_CHUNK_SIZE}` };
            const response = await fetch(encodeURI(`${URL_PREFIX}/fileStore${settings.path}`), { headers, signal });
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
            // try {
            //     // Create an abort controller and get the signal. Add an abort listener to the signal.
            //     connector.abortController = new AbortController();
            //     const signal = connector.abortController.signal;
            //     signal.addEventListener('abort', () => onError(new OperationalError(CALLBACK_RETRIEVE_ABORTED, 'retrieveRecords.abort')), { once: true });

            //     const chunkSize = settings.chunkSize ?? DEFAULT_RETRIEVE_CHUNK_SIZE;
            //     const rowBuffer = this.createRowBuffer(chunk, chunkSize);
            //     const parser = csvParseTool.buildParser({ delimiter: settings.valueDelimiterId, info: true, relax_column_count: true, relax_quotes: true });
            //     parser.on('readable', () => this.handleReadable(parser, signal, rowBuffer, onError));
            //     parser.on('error', (error) => onError(error));
            //     parser.on('end', () => {
            //         try {
            //             signal.throwIfAborted(); // Check if the abort signal has been triggered.
            //             rowBuffer.flush();
            //             connector.abortController = undefined; // Clear the abort controller.
            //             isFinished = true;
            //             complete(this.constructRetrieveRecordsSummary(parser));
            //             resolve();
            //         } catch (error) {
            //             connector.abortController = undefined;
            //             reject(normalizeToError(error));
            //         }
            //     });

            //     void this.streamIntoParser(`${URL_PREFIX}/fileStore${settings.path}`, settings.path, settings.encodingId, signal, parser).catch(onError);
            // } catch (error) {
            //     onError(error);
            // }

            let isFinished = false;

            const onComplete = (summary: RetrieveRecordsSummary): void => {
                signal.throwIfAborted(); // Check if the abort signal has been triggered.
                connector.abortController = undefined; // Clear the abort controller.
                isFinished = true;
                complete(summary);
                resolve();
            };
            const onError = (error: unknown): void => {
                if (isFinished) return;
                isFinished = true;
                if (connector.abortController) connector.abortController.abort();
                connector.abortController = undefined;
                reject(normalizeToError(error));
            };

            connector.abortController = new AbortController();
            const signal = connector.abortController.signal;
            signal.addEventListener('abort', () => onError(new OperationalError(CALLBACK_RETRIEVE_ABORTED, 'retrieveRecords.abort')), { once: true });

            const parseOptions = { delimiter: settings.valueDelimiterId, info: true, relax_column_count: true, relax_quotes: true };
            void csvParseTool.parseStream(parseOptions, settings, `${URL_PREFIX}/fileStore${settings.path}`, signal, onError, onComplete);
        });
    }

    private constructRetrieveRecordsSummary(parser: Parser): RetrieveRecordsSummary {
        return {
            byteCount: parser.info.bytes,
            commentLineCount: parser.info.comment_lines,
            emptyLineCount: parser.info.empty_lines,
            invalidFieldLengthCount: parser.info.invalid_field_length,
            lineCount: parser.info.lines,
            recordCount: parser.info.records
        };
    }

    private createRowBuffer(chunk: (records: string[][]) => void, chunkSize: number): RowBuffer {
        let rows: string[][] = [];
        const flush = (): void => {
            if (rows.length === 0) return;
            chunk(rows);
            rows = [];
        };
        const push = (row: string[]): void => {
            rows.push(row);
            if (rows.length >= chunkSize) flush();
        };
        return { flush, push };
    }

    private handleReadable(parser: Parser, signal: AbortSignal, rowBuffer: RowBuffer, onError: (error: unknown) => void): void {
        try {
            let row: string[] | null;
            while ((row = parser.read() as string[] | null) !== null) {
                signal.throwIfAborted();
                rowBuffer.push(row);
            }
        } catch (error) {
            onError(error);
        }
    }

    private async streamIntoParser(url: string, path: string, encodingId: string, signal: AbortSignal, parser: Parser): Promise<void> {
        const response = await fetch(encodeURI(url), { signal });
        if (!response.ok || !response.body) {
            throw await buildFetchError(response, `Failed to fetch '${path}' file.`, 'datapos-connector-file-store-emulator|Connector|retrieve');
        }

        const reader = response.body.pipeThrough(new TextDecoderStream(encodingId)).getReader();
        let result = await reader.read();
        while (!result.done) {
            signal.throwIfAborted();
            await this.writeToParser(parser, result.value);
            result = await reader.read();
        }

        parser.end();
    }

    private writeToParser(parser: Parser, chunk: string): Promise<void> {
        return new Promise((resolve, reject) => {
            parser.write(chunk, (error) => {
                if (error) reject(error);
                else resolve();
            });
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
