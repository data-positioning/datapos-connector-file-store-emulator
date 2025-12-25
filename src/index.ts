/**
 * File store emulator connector class.
 *
 * TODO: Consider Cloudflare R2 Download URL: https://plugins-eu.datapositioning.app/connectors/datapos-connector-file-store-emulator-es.js.
 * This would allow us to secure the bucket?
 */

/**  Vendor dependencies. */
import { nanoid } from 'nanoid';

/**  Framework dependencies. */
import type { Tool as CSVParseTool } from '@datapos/datapos-tool-csv-parse';
import { loadTool } from '@datapos/datapos-shared/component/tool';
import type { ToolConfig } from '@datapos/datapos-shared/component/tool';
import { buildFetchError, normalizeToError, OperationalError } from '@datapos/datapos-shared/errors';
import type {
    ConnectionConfig,
    ConnectionNodeConfig,
    ConnectorConfig,
    ConnectorInterface,
    FindObjectFolderPathOptions,
    GetReadableStreamOptions,
    ListNodesOptions,
    ListNodesResult,
    PreviewObjectOptions,
    PreviewObjectResult,
    RetrieveRecordsOptions,
    RetrieveRecordsSummary
} from '@datapos/datapos-shared/component/connector';
import { extractExtensionFromPath, extractNameFromPath, lookupMimeTypeForExtension } from '@datapos/datapos-shared/utilities';

/** Data dependencies. */
import config from '~/config.json';
import fileStoreFolderPathData from '@/fileStoreFolderPaths.json';
import { addNumbersWithRust, checksumWithRust } from '@/rustBridge';

/** File store folder paths. */
type FileStoreFolderNode =
    | ({ typeId: 'folder'; childCount: number } & { name: string })
    | ({ typeId: 'object'; id: string; lastModifiedAt: number; size: number } & { name: string });
type FileStoreFolderPaths = Record<string, FileStoreFolderNode[]>;

/** Constants */
const CALLBACK_RETRIEVE_ABORTED = 'Connector failed to abort retrieve all records operation.';
const DEFAULT_PREVIEW_CHUNK_SIZE = 4096;
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
    findObjectFolderPath(connector: ConnectorInterface, options: FindObjectFolderPathOptions): Promise<string | null> {
        const fileStoreFolderPaths = fileStoreFolderPathData as FileStoreFolderPaths;
        // Loop through the folder path data checking for an object entry with an identifier equal to the object name.
        for (const folderPath in fileStoreFolderPaths) {
            if (Object.hasOwn(fileStoreFolderPaths, folderPath)) {
                // eslint-disable-next-line security/detect-object-injection
                const folderPathNodes = fileStoreFolderPaths[folderPath];
                const folderPathNode = folderPathNodes?.find((folderPathNode) => folderPathNode.typeId === 'object' && folderPathNode.id === options.nodeId);
                if (folderPathNode) return Promise.resolve(folderPath); // Found, return folder path.
            }
        }
        return Promise.resolve(null); // Not found.
    }

    /** Get a readable stream for the specified object node path. */
    async getReadableStream(connector: ConnectorInterface, options: GetReadableStreamOptions): Promise<ReadableStream<Uint8Array>> {
        // Create an abort controller and extract its signal.
        const { signal } = (connector.abortController = new AbortController());

        try {
            const response = await fetch(`${URL_PREFIX}/fileStore${options.path}`, { signal });
            if (!response.ok) {
                throw await buildFetchError(response, `Failed to fetch '${options.path}' file.`, 'datapos-connector-file-store-emulator|Connector|getReadableStream');
            }
            if (response.body == null) {
                throw new OperationalError('Readable streams are not supported in this runtime.', 'datapos-connector-file-store-emulator|Connector|getReadableStream.unsupported');
            }

            // TODO: Remove after testing.
            const xxx = await addNumbersWithRust(12, 56);
            const sum = await checksumWithRust(connector.config.version);
            console.log('sum', sum, xxx);

            return await Promise.resolve(response.body);
        } catch (error) {
            throw normalizeToError(error);
        } finally {
            connector.abortController = undefined;
        }
    }

    /** Lists all nodes (folders and objects) in the specified folder path. */
    listNodes(connector: ConnectorInterface, options: ListNodesOptions): Promise<ListNodesResult> {
        const fileStoreFolderPaths = fileStoreFolderPathData as FileStoreFolderPaths;
        const folderNodes = fileStoreFolderPaths[options.folderPath] ?? [];
        const connectionNodeConfigs: ConnectionNodeConfig[] = [];
        for (const folderNode of folderNodes) {
            if (folderNode.typeId === 'folder') {
                connectionNodeConfigs.push(this.constructFolderNodeConfig(options.folderPath, folderNode.name, folderNode.childCount));
            } else {
                connectionNodeConfigs.push(this.constructObjectNodeConfig(options.folderPath, folderNode.id, folderNode.name, folderNode.lastModifiedAt, folderNode.size));
            }
        }
        return Promise.resolve({ cursor: undefined, isMore: false, connectionNodeConfigs, totalCount: connectionNodeConfigs.length });
    }

    /** Preview the contents of the object node with the specified path. */
    async previewObject(connector: ConnectorInterface, options: PreviewObjectOptions): Promise<PreviewObjectResult> {
        // Create an abort controller and extract its signal.
        const { signal } = (connector.abortController = new AbortController());

        try {
            const chunkSize = Math.max(1, options.chunkSize ?? DEFAULT_PREVIEW_CHUNK_SIZE);
            const headers: HeadersInit = { Range: `bytes=0-${chunkSize - 1}` };
            const response = await fetch(encodeURI(`${URL_PREFIX}/fileStore${options.path}`), { headers, signal });
            if (!response.ok) {
                throw await buildFetchError(response, `Failed to fetch '${options.path}' file.`, 'datapos-connector-file-store-emulator|Connector|preview');
            }

            const csvParseTool = await loadTool<CSVParseTool>(connector.toolConfigs, 'csv-parse');

            return { data: new Uint8Array(await response.arrayBuffer()), typeId: 'uint8Array' };
        } catch (error) {
            throw normalizeToError(error);
        } finally {
            connector.abortController = undefined;
        }
    }
    /** Retrieves all records from a CSV object node using streaming and chunked processing. */
    async retrieveRecords(connector: ConnectorInterface, options: RetrieveRecordsOptions): Promise<void> {
        const csvParseTool = await loadTool<CSVParseTool>(connector.toolConfigs, 'csv-parse');

        return new Promise((resolve, reject) => {
            let isSettled = false;
            const { signal } = (connector.abortController = new AbortController());
            signal.addEventListener('abort', () => handleError(new OperationalError(CALLBACK_RETRIEVE_ABORTED, 'retrieveRecords.abort')), { once: true });

            const finalize = (settle: () => void): void => {
                if (isSettled) return;
                isSettled = true;
                connector.abortController = undefined;
                settle();
            };

            const handleError = (error: unknown): void => {
                finalize(() => reject(normalizeToError(error)));
            };

            const handleComplete = (summary: RetrieveRecordsSummary): void => {
                try {
                    signal.throwIfAborted();
                    options.complete(summary);
                    finalize(() => resolve());
                } catch (error) {
                    handleError(error);
                }
            };

            const parseOptions = { delimiter: options.valueDelimiterId, info: true, relax_column_count: true, relax_quotes: true };
            const url = `${URL_PREFIX}/fileStore${options.path}`;
            console.log(1111);
            void csvParseTool.parseStream(parseOptions, options, url, signal, handleError, handleComplete).catch((error: unknown) => handleError(error));
            console.log(9999);
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
