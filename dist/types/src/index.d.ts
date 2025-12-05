import { ConnectionConfig, Connector, ConnectorConfig, ConnectorTools, FindResult, FindSettings, ListResult, ListSettings, PreviewResult, PreviewSettings, RetrieveSettings, RetrieveSummary } from '@datapos/datapos-shared';
export default class FileStoreEmulatorConnector implements Connector {
    abortController: AbortController | undefined;
    readonly config: ConnectorConfig;
    readonly connectionConfig: ConnectionConfig;
    readonly tools: ConnectorTools;
    constructor(connectionConfig: ConnectionConfig, tools: ConnectorTools);
    abortOperation(connector: FileStoreEmulatorConnector): void;
    findObject(connector: FileStoreEmulatorConnector, settings: FindSettings): Promise<FindResult>;
    listNodes(connector: FileStoreEmulatorConnector, settings: ListSettings): Promise<ListResult>;
    previewObject(connector: FileStoreEmulatorConnector, settings: PreviewSettings): Promise<PreviewResult>;
    retrieveRecords(connector: FileStoreEmulatorConnector, settings: RetrieveSettings, chunk: (records: string[][]) => void, complete: (result: RetrieveSummary) => void): Promise<void>;
    private constructFolderNodeConfig;
    private constructObjectNodeConfig;
}
