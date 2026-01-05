import { DataViewPreviewConfig, ObjectRecord } from '@datapos/datapos-shared/component/dataView';
import { EngineUtilities } from '@datapos/datapos-shared/engine';
import { ConnectorConfig, ConnectorInterface, FindObjectFolderPathOptions, GetReadableStreamOptions, ListNodesOptions, ListNodesResult, PreviewObjectOptions, RetrieveRecordsOptions, RetrieveRecordsSummary } from '@datapos/datapos-shared/component/connector';
import { ToolConfig } from '@datapos/datapos-shared/component/tool';
/**
 * File store emulator connector.
 */
declare class Connector implements ConnectorInterface {
    abortController: AbortController | undefined;
    readonly config: ConnectorConfig;
    engineUtilities: EngineUtilities;
    readonly toolConfigs: ToolConfig[];
    constructor(engineUtilities: EngineUtilities, toolConfigs: ToolConfig[]);
    /**
     * Abort the currently running operation.
     */
    abortOperation(): void;
    /**
     * Find the folder path containing the specified object node.
     */
    findObjectFolderPath(options: FindObjectFolderPathOptions): Promise<string | null>;
    /**
     * Get a readable stream for the specified object node path.
     */
    getReadableStream(options: GetReadableStreamOptions): Promise<ReadableStream<Uint8Array>>;
    /**
     * Lists all nodes (folders and objects) in the specified folder path.
     */
    listNodes(options: ListNodesOptions): Promise<ListNodesResult>;
    /**
     * Preview the contents of the object node with the specified path.
     */
    previewObject(options: PreviewObjectOptions): Promise<DataViewPreviewConfig>;
    /**
     * Retrieves all records from a CSV object node using streaming and chunked processing.
     */
    retrieveRecords(options: RetrieveRecordsOptions, chunk: (records: ObjectRecord[]) => void, complete: (result: RetrieveRecordsSummary) => void): Promise<void>;
}
export { Connector };
