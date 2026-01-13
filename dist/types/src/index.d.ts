import { EngineUtilities } from '@datapos/datapos-shared/engine';
import { AuditObjectContentOptions2, AuditObjectContentResult2, ConnectorConfig, ConnectorInterface, FindObjectFolderPathOptions, GetReadableStreamOptions, ListNodesOptions, ListNodesResult, PreviewObjectOptions, RetrieveRecordsOptions, RetrieveRecordsSummary } from '@datapos/datapos-shared/component/connector';
import { ToolConfig } from '@datapos/datapos-shared/component/tool';
import { ParsingRecord, PreviewConfig } from '@datapos/datapos-shared/component/dataView';
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
     * Audit the content of a CSV file using Rust CSV parser.
     * Automatically selects the appropriate processing mode based on browser capabilities.
     */
    auditContent(path: string, supportsTransferableStreams: boolean, onProgress?: (rowCount: number) => void): Promise<{
        processedRowCount: number;
        durationMs?: number;
    }>;
    /**
     * Audit object content.
     */
    auditObjectContent(options: AuditObjectContentOptions2, chunk: (rowCount: number) => void): Promise<AuditObjectContentResult2>;
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
    previewObject(options: PreviewObjectOptions): Promise<PreviewConfig>;
    /**
     * Retrieves all records from a CSV object node using streaming and chunked processing.
     */
    retrieveRecords(options: RetrieveRecordsOptions, chunk: (records: ParsingRecord[]) => void, complete: (result: RetrieveRecordsSummary) => void): Promise<void>;
}
export { Connector };
