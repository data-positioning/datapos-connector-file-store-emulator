import { CSVParseTool } from '@datapos/datapos-tool-csv-parse';
import { ConnectionConfig, Connector, ConnectorConfig, ConnectorTools, FindResult, FindSettings, GetReadableStreamResult, GetReadableStreamSettings, ListResult, ListSettings, PreviewResult, PreviewSettings, RetrieveRecordsSettings, RetrieveRecordsSummary, ToolConfig } from '@datapos/datapos-shared';
/** Classes - File store emulator connector. */
export default class FileStoreEmulatorConnector implements Connector {
    abortController: AbortController | undefined;
    readonly config: ConnectorConfig;
    readonly connectionConfig: ConnectionConfig;
    readonly tools: ConnectorTools;
    readonly toolConfigs: ToolConfig[];
    csvParseTool: CSVParseTool | undefined;
    constructor(connectionConfig: ConnectionConfig, tools: ConnectorTools, toolConfigs: ToolConfig[]);
    abortOperation(connector: FileStoreEmulatorConnector): void;
    findObject(connector: FileStoreEmulatorConnector, settings: FindSettings): Promise<FindResult>;
    getReadableStream(connector: FileStoreEmulatorConnector, settings: GetReadableStreamSettings): Promise<GetReadableStreamResult>;
    listNodes(connector: FileStoreEmulatorConnector, settings: ListSettings): Promise<ListResult>;
    previewObject(connector: FileStoreEmulatorConnector, settings: PreviewSettings): Promise<PreviewResult>;
    retrieveRecords(connector: FileStoreEmulatorConnector, settings: RetrieveRecordsSettings, chunk: (records: string[][]) => void, complete: (result: RetrieveRecordsSummary) => void): Promise<void>;
    /** Utilities - Construct folder node configuration. */
    private constructFolderNodeConfig;
    /** Utilities - Construct object (file) node configuration. */
    private constructObjectNodeConfig;
    private loadCSVParseTool;
}
