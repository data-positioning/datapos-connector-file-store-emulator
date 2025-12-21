import { ConnectionConfig, Connector, ConnectorConfig, ConnectorTools, FindResult, FindSettings, GetReaderResult, GetReaderSettings, ListResult, ListSettings, PreviewResult, PreviewSettings, RetrieveSettings, RetrieveSummary } from '@datapos/datapos-shared';
/** Classes - File store emulator connector. */
export default class FileStoreEmulatorConnector implements Connector {
    abortController: AbortController | undefined;
    readonly config: ConnectorConfig;
    readonly connectionConfig: ConnectionConfig;
    readonly tools: ConnectorTools;
    constructor(connectionConfig: ConnectionConfig, tools: ConnectorTools);
    abortOperation(connector: FileStoreEmulatorConnector): void;
    findObject(connector: FileStoreEmulatorConnector, settings: FindSettings): Promise<FindResult>;
    ReadableStream(connector: FileStoreEmulatorConnector, settings: GetReaderSettings): Promise<GetReaderResult>;
    listNodes(connector: FileStoreEmulatorConnector, settings: ListSettings): Promise<ListResult>;
    previewObject(connector: FileStoreEmulatorConnector, settings: PreviewSettings): Promise<PreviewResult>;
    retrieveRecords(connector: FileStoreEmulatorConnector, settings: RetrieveSettings, chunk: (records: string[][]) => void, complete: (result: RetrieveSummary) => void): Promise<void>;
    /** Utilities - Construct folder node configuration. */
    private constructFolderNodeConfig;
    /** Utilities - Construct object (file) node configuration. */
    private constructObjectNodeConfig;
}
