/**
 * @file datapos-connector-data-file-store-emulator/src/index.ts
 * @description The File Store Emulator data connector.
 * @license ISC Licensed under the ISC license, Version 2.0. See the LICENSE.md file for details.
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2023 Jonathan Terrell
 */
import type { CallbackData, ConnectionConfig, ConnectionEntryDrilldownResult, ConnectorConfig, DataConnector, DataConnectorPreviewInterface, DataConnectorReadInterface, DataConnectorRetrieveEntriesSettings } from '@datapos/datapos-engine-support';
export default class FileStoreEmulatorDataConnector implements DataConnector {
    abortController: AbortController | undefined;
    readonly config: ConnectorConfig;
    readonly connectionConfig: ConnectionConfig;
    readonly version: string;
    constructor(connectionConfig: ConnectionConfig);
    /**
     * Aborts an operation if it is currently in progress.
     * If an AbortController is associated with this instance, it calls its 'abort' method.
     * If no AbortController is set, this function does nothing.
     */
    abort(): void;
    /**
     * Retrieves the preview interface for the data connector.
     * @returns The preview interface object.
     */
    getPreviewInterface(): DataConnectorPreviewInterface;
    /**
     * Retrieves the read interface for the data connector.
     * @returns The read interface object.
     */
    getReadInterface(): DataConnectorReadInterface;
    /**
     * Retrieves a page of entries for a given account, using the provided session access token and parent connection entry.
     * @param accountId - The ID of the account.
     * @param sessionAccessToken - The session access token.
     * @param settings -
     * @param callback -
     * @returns A promise that resolves to a page of connection entries.
     */
    retrieveConnectionEntries(accountId: string, sessionAccessToken: string, settings: DataConnectorRetrieveEntriesSettings, callback: (data: CallbackData) => void): Promise<ConnectionEntryDrilldownResult>;
}
