import { DataViewPreviewConfig } from '@datapos/datapos-shared';
import { EngineShared } from '@datapos/datapos-shared/engine';
import { ConnectorConfig, ConnectorInterface, FindObjectFolderPathOptions, GetReadableStreamOptions, ListNodesOptions, ListNodesResult, PreviewObjectOptions, RetrieveRecordsOptions, RetrieveRecordsSummary } from '@datapos/datapos-shared/component/connector';
import { ToolConfig } from '@datapos/datapos-shared/component/tool';
/** File store emulator connector. */
declare class Connector implements ConnectorInterface {
    abortController: AbortController | undefined;
    readonly config: ConnectorConfig;
    readonly toolConfigs: ToolConfig[];
    constructor(toolConfigs: ToolConfig[]);
    /** Abort the currently running operation. */
    abortOperation(connector: ConnectorInterface): void;
    /** Find the folder path containing the specified object node. */
    findObjectFolderPath(connector: ConnectorInterface, options: FindObjectFolderPathOptions): Promise<string | null>;
    /** Get a readable stream for the specified object node path. */
    getReadableStream(connector: ConnectorInterface, options: GetReadableStreamOptions): Promise<ReadableStream<Uint8Array>>;
    /** Lists all nodes (folders and objects) in the specified folder path. */
    listNodes(connector: ConnectorInterface, options: ListNodesOptions): Promise<ListNodesResult>;
    /** Preview the contents of the object node with the specified path. */
    previewObject(engineShared: EngineShared, connector: ConnectorInterface, options: PreviewObjectOptions): Promise<DataViewPreviewConfig>;
    /** Retrieves all records from a CSV object node using streaming and chunked processing. */
    retrieveRecords(connector: ConnectorInterface, options: RetrieveRecordsOptions, chunk: (records: (string[] | Record<string, unknown>)[]) => void, complete: (result: RetrieveRecordsSummary) => void): Promise<void>;
    /** Construct folder node configuration. */
    private constructFolderNodeConfig;
    /** Construct object (file) node configuration. */
    private constructObjectNodeConfig;
}
/** Exports. */
export { Connector };
