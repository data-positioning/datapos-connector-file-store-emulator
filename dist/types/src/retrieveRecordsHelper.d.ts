import { ConnectorInterface, RetrieveRecordsSettings, RetrieveRecordsSummary } from '@datapos/datapos-shared/component/connector';
type RetrieveRecordsConfig = {
    urlPrefix?: string;
    chunkSize?: number;
    csvToolId?: string;
};
export declare function retrieveRecordsStream(connector: ConnectorInterface, settings: RetrieveRecordsSettings, chunk: (records: string[][]) => void, complete: (result: RetrieveRecordsSummary) => void, config?: RetrieveRecordsConfig): Promise<void>;
export {};
