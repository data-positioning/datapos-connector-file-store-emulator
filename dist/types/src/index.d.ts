import { ToolConfig } from '@datapos/datapos-shared/component/tool';
import { ConnectionConfig, ConnectorConfig, ConnectorInterface, FindObjectFolderPathSettings, GetReadableStreamSettings, ListNodesResult, ListNodesSettings, PreviewObjectResult, PreviewObjectSettings, RetrieveRecordsSettings, RetrieveRecordsSummary } from '@datapos/datapos-shared/component/connector';
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
    findObjectFolderPath(connector: ConnectorInterface, settings: FindObjectFolderPathSettings): Promise<string | null>;
    /** Get a readable stream for the specified object node path. */
    getReadableStream(connector: ConnectorInterface, settings: GetReadableStreamSettings): Promise<ReadableStream<Uint8Array<ArrayBuffer>>>;
    /** Lists all nodes (folders and objects) in the specified folder path. */
    listNodes(connector: ConnectorInterface, settings: ListNodesSettings): Promise<ListNodesResult>;
    /** Preview the contents of the object node with the specified path. */
    previewObject(connector: ConnectorInterface, settings: PreviewObjectSettings): Promise<PreviewObjectResult>;
    /** Retrieves all records from a CSV object node using streaming and chunked processing. */
    retrieveRecords(connector: ConnectorInterface, settings: RetrieveRecordsSettings, chunk: (records: string[][]) => void, complete: (result: RetrieveRecordsSummary) => void): Promise<void>;
    private constructRetrieveRecordsSummary;
    private createRowBuffer;
    private handleReadable;
    private streamIntoParser;
    private writeToParser;
    /** Construct folder node configuration. */
    private constructFolderNodeConfig;
    /** Construct object (file) node configuration. */
    private constructObjectNodeConfig;
}
