import { ToolConfig } from '@datapos/datapos-shared';
import { ConnectionConfig, Connector, ConnectorConfig, FindResult, FindSettings, GetReadableStreamResult, GetReadableStreamSettings, ListResult, ListSettings, PreviewResult, PreviewSettings, RetrieveRecordsSettings, RetrieveRecordsSummary } from '@datapos/datapos-shared/component/connector';
/** Classes - File store emulator connector. */
export default class FileStoreEmulatorConnector implements Connector {
    abortController: AbortController | undefined;
    readonly config: ConnectorConfig;
    readonly connectionConfig: ConnectionConfig;
    readonly toolConfigs: ToolConfig[];
    constructor(connectionConfig: ConnectionConfig, toolConfigs: ToolConfig[]);
    /** Abort operation. */
    abortOperation(connector: Connector): void;
    /** Find object. */
    findObject(connector: Connector, settings: FindSettings): Promise<FindResult>;
    getReadableStream(connector: Connector, settings: GetReadableStreamSettings): Promise<GetReadableStreamResult>;
    listNodes(connector: Connector, settings: ListSettings): Promise<ListResult>;
    previewObject(connector: Connector, settings: PreviewSettings): Promise<PreviewResult>;
    retrieveRecords(connector: Connector, settings: RetrieveRecordsSettings, chunk: (records: string[][]) => void, complete: (result: RetrieveRecordsSummary) => void): Promise<void>;
    /** Utilities - Construct folder node configuration. */
    private constructFolderNodeConfig;
    /** Utilities - Construct object (file) node configuration. */
    private constructObjectNodeConfig;
    private loadTool;
}
