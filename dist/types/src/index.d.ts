import { ToolConfig } from '@datapos/datapos-shared/component/tool';
import { ConnectionConfig, ConnectorConfig, ConnectorInterface, FindObjectFolderPathOptions, GetReadableStreamOptions, ListNodesOptions, ListNodesResult, PreviewObjectOptions, PreviewObjectResult, RetrieveChunksSummary, RetrieveRecordsOptions } from '@datapos/datapos-shared/component/connector';
/** File store emulator connector. */
export default class FileStoreEmulatorConnector implements ConnectorInterface {
    abortController: AbortController | undefined;
    readonly config: ConnectorConfig;
    readonly connectionConfig: ConnectionConfig;
    readonly toolConfigs: ToolConfig[];
    constructor(connectionConfig: ConnectionConfig, toolConfigs: ToolConfig[]);
    /** Abort the currently running operation. */
    abortOperation(connector: ConnectorInterface): void;
    /** Find the folder path containing the specified object node. */
    findObjectFolderPath(connector: ConnectorInterface, options: FindObjectFolderPathOptions): Promise<string | null>;
    /** Get a readable stream for the specified object node path. */
    getReadableStream(connector: ConnectorInterface, options: GetReadableStreamOptions): Promise<ReadableStream<Uint8Array>>;
    /** Lists all nodes (folders and objects) in the specified folder path. */
    listNodes(connector: ConnectorInterface, options: ListNodesOptions): Promise<ListNodesResult>;
    /** Preview the contents of the object node with the specified path. */
    previewObject(connector: ConnectorInterface, options: PreviewObjectOptions): Promise<PreviewObjectResult>;
    /** Retrieves all records from a CSV object node using streaming and chunked processing. */
    retrieveRecords(connector: ConnectorInterface, options: RetrieveRecordsOptions, chunk: (records: (string[] | Record<string, unknown>)[]) => void, complete: (result: RetrieveChunksSummary) => void): Promise<void>;
    /** Construct folder node configuration. */
    private constructFolderNodeConfig;
    /** Construct object (file) node configuration. */
    private constructObjectNodeConfig;
}
