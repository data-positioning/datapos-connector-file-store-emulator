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
import type { DataViewPreviewConfig } from '@datapos/datapos-shared';
import type { Tool as FileOperatorsTool } from '@datapos/datapos-tool-file-operators';
import { buildFetchError, normalizeToError, OperationalError } from '@datapos/datapos-shared/errors';
import type {
    ConnectionNodeConfig,
    ConnectorConfig,
    ConnectorInterface,
    FindObjectFolderPathOptions,
    GetReadableStreamOptions,
    ListNodesOptions,
    ListNodesResult,
    PreviewObjectOptions,
    RetrieveRecordsOptions,
    RetrieveRecordsSummary
} from '@datapos/datapos-shared/component/connector';
import { extractExtensionFromPath, extractNameFromPath, lookupMimeTypeForExtension } from '@datapos/datapos-shared/utilities';
import { loadTool, type ToolConfig } from '@datapos/datapos-shared/component/tool';

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
const URL_PREFIX = 'https://sample-data-eu.datapos.app';

/** File store emulator connector. */
class Connector implements ConnectorInterface {
    abortController: AbortController | undefined;
    readonly config: ConnectorConfig;
    readonly toolConfigs;

    constructor(toolConfigs: ToolConfig[]) {
        this.abortController = undefined;
        this.config = config as ConnectorConfig;
        this.toolConfigs = toolConfigs;
    }

    //#region: Operations. #####

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
    async previewObject(connector: ConnectorInterface, options: PreviewObjectOptions): Promise<DataViewPreviewConfig> {
        // Create an abort controller and extract its signal.
        const { signal } = (connector.abortController = new AbortController());

        try {
            const asAt = Date.now();
            const startedAt = performance.now();

            const fileOperatorsTool = await loadTool<FileOperatorsTool>(connector.toolConfigs, 'file-operators');
            const previewConfig = await fileOperatorsTool.previewFile(`${URL_PREFIX}/fileStore${options.path}`, signal, options.chunkSize);

            const csvParseTool = await loadTool<CSVParseTool>(connector.toolConfigs, 'csv-parse');
            if (previewConfig.text == null) {
                throw new Error('File is empty.');
            } else {
                const schemaConfig = csvParseTool.determineSchemaConfig(previewConfig.text, [',', ';', '|']);
                console.log('schemaConfig', schemaConfig);
            }

            if (previewConfig.dataFormatId == null) throw new Error('Connector unable to process files of this type.');

            const duration = performance.now() - startedAt;
            return {
                asAt,
                columnConfigs: [],
                dataFormatId: previewConfig.dataFormatId,
                duration,
                encodingId: previewConfig.encodingId,
                encodingConfidenceLevel: previewConfig.encodingConfidenceLevel,
                fileType: previewConfig.fileTypeConfig,
                hasHeaders: undefined,
                records: [],
                size: previewConfig.bytes.length,
                text: previewConfig.text
            };
        } catch (error) {
            throw normalizeToError(error);
        } finally {
            connector.abortController = undefined;
        }
    }
    /** Retrieves all records from a CSV object node using streaming and chunked processing. */
    async retrieveRecords(
        connector: ConnectorInterface,
        options: RetrieveRecordsOptions,
        chunk: (records: (string[] | Record<string, unknown>)[]) => void,
        complete: (result: RetrieveRecordsSummary) => void
    ): Promise<void> {
        connector.abortController = new AbortController();

        try {
            const csvParseTool = await loadTool<CSVParseTool>(connector.toolConfigs, 'csv-parse');
            const parseStreamOptions = { delimiter: options.valueDelimiterId, info: true, relax_column_count: true, relax_quotes: true };
            const url = `${URL_PREFIX}/fileStore${options.path}`;
            const summary = await csvParseTool.parseStream(options, parseStreamOptions, url, connector.abortController, chunk);
            complete(summary);
        } catch (error) {
            throw normalizeToError(error);
        } finally {
            connector.abortController = undefined;
        }
    }

    //#endregion

    //#region: Helpers. #####

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

    //#endregion
}

// Exports.
export { Connector };
