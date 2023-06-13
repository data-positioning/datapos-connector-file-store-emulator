/**
 * @file datapos-connector-data-file-store-emulator/src/index.ts
 * @description The File Store Emulator data connector.
 * @license ISC Licensed under the ISC license, Version 2.0. See the LICENSE.md file for details.
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2023 Jonathan Terrell
 */

// Constants
const ABORTED_PREVIEW_MESSAGE = 'Aborted preview connection entry.';
const ABORTED_READ_MESSAGE = 'Aborted read connection entry.';
const DEFAULT_PREVIEW_CHUNK_SIZE = 4096;
const DEFAULT_READ_CHUNK_SIZE = 1000;
const FAILED_TO_READ_MESSAGE = 'Failed to read connection entry.';
const FAILED_TO_PREVIEW_MESSAGE = 'Failed to preview connection entry.';
const FAILED_TO_RETRIEVE_MESSAGE = 'Failed to retrieve connection entries.';
const URL_PREFIX = 'https://datapos-resources.netlify.app/fileStore';

// Dependencies - Asset
import config from './config.json';
import fileStoreIndex from './fileStoreIndex.json';
import { version } from '../package.json';

// Dependencies - Engine - Support
import {
    AbortError,
    ConnectionEntryPreviewTypeId,
    ConnectionEntryTypeId,
    ConnectorContextError,
    extractFileExtensionFromFilePath,
    extractFileNameFromFilePath,
    extractLastSegmentFromPath,
    FetchResponseError,
    lookupMimeTypeForFileExtension
} from '@datapos/datapos-engine-support';
import type {
    CallbackData,
    ConnectionConfig,
    ConnectionEntry,
    ConnectionEntryDrilldownResult,
    ConnectionEntryPreview,
    ConnectorConfig,
    DataConnector,
    DataConnectorFieldInfo,
    DataConnectorPreviewInterface,
    DataConnectorPreviewInterfaceSettings,
    DataConnectorReadInterface,
    DataConnectorReadInterfaceSettings,
    DataConnectorRecord,
    DataConnectorRetrieveEntriesSettings,
    SourceViewConfig
} from '@datapos/datapos-engine-support';

// Dependencies - Framework/Vendor
import type { Callback, CastingContext, Options, Parser } from 'csv-parse';

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// File Store Emulator Data Connector
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export default class FileStoreEmulatorDataConnector implements DataConnector {
    abortController: AbortController | undefined;
    readonly config: ConnectorConfig;
    readonly connectionConfig: ConnectionConfig;
    readonly version: string;

    constructor(connectionConfig: ConnectionConfig) {
        this.abortController = undefined;
        this.config = config as unknown as ConnectorConfig;
        this.connectionConfig = connectionConfig;
        this.version = version;
    }

    /**
     * Aborts an operation if it is currently in progress.
     * If an AbortController is associated with this instance, it calls its 'abort' method.
     * If no AbortController is set, this function does nothing.
     */
    abort(): void {
        if (!this.abortController) return;
        this.abortController.abort();
        this.abortController = undefined;
    }

    /**
     * Retrieves the preview interface for the data connector.
     * @returns The preview interface object.
     */
    getPreviewInterface(): DataConnectorPreviewInterface {
        return { connector: this, previewConnectionEntry };
    }

    /**
     * Retrieves the read interface for the data connector.
     * @returns The read interface object.
     */
    getReadInterface(): DataConnectorReadInterface {
        return { connector: this, readConnectionEntry };
    }

    /**
     * Retrieves a page of entries for a given account, using the provided session access token and parent connection entry.
     * @param accountId - The ID of the account.
     * @param sessionAccessToken - The session access token.
     * @param settings -
     * @param callback -
     * @returns A promise that resolves to a page of connection entries.
     */
    async retrieveConnectionEntries(
        accountId: string,
        sessionAccessToken: string,
        settings: DataConnectorRetrieveEntriesSettings,
        callback: (data: CallbackData) => void
    ): Promise<ConnectionEntryDrilldownResult> {
        return await retrieveConnectionEntries(settings.folderPath, callback);
    }
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// File Store Emulator Data Connector - Retrieve Connection Entries
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Retrieves connection entries for a given folder path.
 * @param folderPath - The folder path.
 * @param callback -
 * @returns A promise that resolves to the connection entries page.
 */
const retrieveConnectionEntries = (folderPath: string, callback: (data: CallbackData) => void): Promise<ConnectionEntryDrilldownResult> => {
    return new Promise((resolve, reject) => {
        try {
            callback({ typeId: 'test', properties: { aProp: 'value 1' } });
            const items = (fileStoreIndex as Record<string, { lastModifiedAt?: number; path: string; size?: number; typeId: string }[]>)[folderPath];
            const entries: ConnectionEntry[] = [];
            for (const item of items) {
                if (item.typeId === 'folder') {
                    entries.push(buildFolderEntry(item.path, 0));
                } else {
                    entries.push(buildFileEntry(folderPath, item.path, item.lastModifiedAt, item.size));
                }
            }
            callback({ typeId: 'test', properties: { aProp: 'value 2' } });
            resolve({ cursor: undefined, isMore: false, entries, totalCount: entries.length });
        } catch (error) {
            reject(tidyUp(undefined, FAILED_TO_RETRIEVE_MESSAGE, 'retrieveConnectionEntries.1', error));
        }
    });
};

/**
 * Builds a 'ConnectionEntry' object representing a folder.
 * @param folderPath - The path of the folder.
 * @param childCount - The number of child entries in the folder.
 * @returns A 'ConnectionEntry' object representing the folder.
 */
const buildFolderEntry = (folderPath: string, childCount: number): ConnectionEntry => {
    const lastFolderName = extractLastSegmentFromPath(folderPath);
    return {
        childCount,
        folderPath,
        encodingId: undefined,
        extension: undefined,
        handle: undefined,
        id: undefined,
        label: lastFolderName,
        lastModifiedAt: undefined,
        mimeType: undefined,
        name: undefined,
        referenceId: undefined,
        size: undefined,
        typeId: ConnectionEntryTypeId.Folder
    };
};

/**
 * Builds a 'ConnectionEntry' object representing a file.
 * @param folderPath - The folder path of the file.
 * @param filePath - The path of the file.
 * @param lastModifiedAt - The moment the file was last modified.
 * @param size - The size of the file.
 * @returns A 'ConnectionEntry' object representing the file.
 */
const buildFileEntry = (folderPath: string, filePath: string, lastModifiedAt: number, size: number): ConnectionEntry => {
    const fullFileName = extractLastSegmentFromPath(filePath);
    const fileName = extractFileNameFromFilePath(fullFileName);
    const fileExtension = extractFileExtensionFromFilePath(fullFileName);
    return {
        childCount: undefined,
        folderPath,
        encodingId: undefined,
        extension: fileExtension,
        handle: undefined,
        id: undefined,
        label: fullFileName,
        lastModifiedAt,
        mimeType: lookupMimeTypeForFileExtension(fileExtension),
        name: fileName,
        referenceId: undefined,
        size,
        typeId: ConnectionEntryTypeId.File
    };
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// File Store Emulator Data Connector - Preview Connection Entry
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Retrieves a preview of a file entry from a data connector.
 * @param connector - The data connector.
 * @param accountId - The account ID.
 * @param sessionAccessToken - The session access token.
 * @param sourceViewConfig - The source view configuration.
 * @param previewInterfaceSettings - The preview interface settings.
 * @param callback -
 * @returns A promise that resolves to the connection entry preview.
 * @throws {FetchResponseError} If there is an error in the fetch response.
 */
const previewConnectionEntry = (
    connector: DataConnector,
    accountId: string | undefined,
    sessionAccessToken: string | undefined,
    sourceViewConfig: SourceViewConfig,
    previewInterfaceSettings: DataConnectorPreviewInterfaceSettings,
    callback: (data: CallbackData) => void
): Promise<ConnectionEntryPreview> => {
    return new Promise((resolve, reject) => {
        try {
            // Create an abort controller. Get the signal for the abort controller and add an abort listener.
            connector.abortController = new AbortController();
            const signal = connector.abortController.signal;
            signal.addEventListener(
                'abort',
                () => reject(tidyUp(connector, FAILED_TO_PREVIEW_MESSAGE, 'previewConnectionEntry.5', new AbortError(ABORTED_PREVIEW_MESSAGE)))
                /*, { once: true, signal } TODO: Don't need once and signal? */
            );

            // ...
            const fullFileName = `${sourceViewConfig.fileName}${sourceViewConfig.fileExtension ? `.${sourceViewConfig.fileExtension}` : ''}`;
            const url = `${URL_PREFIX}${sourceViewConfig.folderPath}/${fullFileName}`;
            const headers: HeadersInit = { Range: `bytes=0-${previewInterfaceSettings.chunkSize || DEFAULT_PREVIEW_CHUNK_SIZE}` };
            console.log('aaaa');
            fetch(encodeURI(url), { headers, signal })
                .then(async (response) => {
                    try {
                        console.log('bbbb');
                        if (response.ok) {
                            console.log('cccc');
                            const result = await response.arrayBuffer();
                            connector.abortController = undefined;
                            resolve({ data: new Uint8Array(result), typeId: ConnectionEntryPreviewTypeId.Uint8Array });
                        } else {
                            console.log('dddd');
                            const error = new FetchResponseError(response.status, response.statusText, await response.text());
                            reject(tidyUp(connector, FAILED_TO_PREVIEW_MESSAGE, 'previewConnectionEntry.4', error));
                        }
                    } catch (error) {
                        console.log('eeee');
                        reject(tidyUp(connector, FAILED_TO_PREVIEW_MESSAGE, 'previewConnectionEntry.3', error));
                    }
                })
                .catch((error) => {
                    console.log('ffff');
                    reject(tidyUp(connector, FAILED_TO_PREVIEW_MESSAGE, 'previewConnectionEntry.2', error));
                });
        } catch (error) {
            console.log('gggg');
            reject(tidyUp(connector, FAILED_TO_PREVIEW_MESSAGE, 'previewConnectionEntry.1', error));
        }
    });
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// File Store Emulator Data Connector - Read Connection Entry
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Reads a file entry from a data connector.
 * @param connector - The data connector.
 * @param accountId - The account identifier.
 * @param sessionAccessToken - The session access token.
 * @param sourceViewConfig - The source view configuration.
 * @param readInterfaceSettings - The read interface settings.
 * @param csvParse - The CSV parse function from the 'csvparse' library.
 * @param callback -
 * @returns A promise that resolves when the file entry has been read.
 */
const readConnectionEntry = (
    connector: DataConnector,
    accountId: string,
    sessionAccessToken: string,
    sourceViewConfig: SourceViewConfig,
    readInterfaceSettings: DataConnectorReadInterfaceSettings,
    csvParse: (options?: Options, callback?: Callback) => Parser, // TODO: typeof import('csv-parse/browser/esm'). Keep just in case.
    callback: (data: CallbackData) => void
): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            // Create an abort controller and get the signal. Add an abort listener to the signal.
            connector.abortController = new AbortController();
            const signal = connector.abortController.signal;
            signal.addEventListener(
                'abort',
                () => reject(tidyUp(connector, FAILED_TO_READ_MESSAGE, 'readConnectionEntry.8', new AbortError(ABORTED_READ_MESSAGE)))
                /*, { once: true, signal } TODO: Don't need once and signal? */
            );

            // Parser - Declare variables.
            let pendingRows: DataConnectorRecord[] = []; // Array to store rows of parsed field values and associated information.
            const fieldInfos: DataConnectorFieldInfo[] = []; // Array to store field information for a single row.

            // Parser - Create a parser object for CSV parsing.
            const parser = csvParse({
                cast: (value, context) => {
                    fieldInfos[context.index] = { isQuoted: context.quoting };
                    return value;
                },
                delimiter: sourceViewConfig.preview.valueDelimiterId,
                info: true,
                relax_column_count: true,
                relax_quotes: true
            });

            // Parser - Event listener for the 'readable' (data available) event.
            parser.on('readable', () => {
                try {
                    let data;
                    while ((data = parser.read() as { info: CastingContext; record: string[] }) !== null) {
                        signal.throwIfAborted(); // Check if the abort signal has been triggered.
                        pendingRows.push({ fieldInfos, fieldValues: data.record }); // Append the row of parsed values and associated information to the pending rows array.
                        if (pendingRows.length < DEFAULT_READ_CHUNK_SIZE) continue; // Continue with next iteration if the pending rows array is not yet full.
                        readInterfaceSettings.chunk(pendingRows); // Pass the pending rows to the engine using the 'chunk' callback.
                        pendingRows = []; // Clear the pending rows array in preparation for the next batch of data.
                    }
                } catch (error) {
                    reject(tidyUp(connector, FAILED_TO_READ_MESSAGE, 'readConnectionEntry.7', error));
                }
            });

            // Parser - Event listener for the 'error' event.
            parser.on('error', (error) => reject(tidyUp(connector, FAILED_TO_READ_MESSAGE, 'readConnectionEntry.6', error)));

            // Parser - Event listener for the 'end' (end of data) event.
            parser.on('end', () => {
                try {
                    signal.throwIfAborted(); // Check if the abort signal has been triggered.
                    connector.abortController = undefined; // Clear the abort controller.
                    if (pendingRows.length > 0) {
                        readInterfaceSettings.chunk(pendingRows);
                        pendingRows = [];
                    }
                    readInterfaceSettings.complete({
                        byteCount: parser.info.bytes,
                        commentLineCount: parser.info.comment_lines,
                        emptyLineCount: parser.info.empty_lines,
                        invalidFieldLengthCount: parser.info.invalid_field_length,
                        lineCount: parser.info.lines,
                        recordCount: parser.info.records
                    });
                    resolve();
                } catch (error) {
                    reject(tidyUp(connector, FAILED_TO_READ_MESSAGE, 'readConnectionEntry.5', error));
                }
            });

            // Fetch, decode and forward the contents of the file to the parser.
            const fullFileName = `${sourceViewConfig.fileName}${sourceViewConfig.fileExtension ? `.${sourceViewConfig.fileExtension}` : ''}`;
            const url = `${URL_PREFIX}${sourceViewConfig.folderPath}/${fullFileName}`;
            fetch(encodeURI(url), { signal })
                .then(async (response) => {
                    try {
                        const stream = response.body.pipeThrough(new TextDecoderStream(sourceViewConfig.preview.encodingId));
                        const decodedStreamReader = stream.getReader();
                        let result;
                        while (!(result = await decodedStreamReader.read()).done) {
                            signal.throwIfAborted(); // Check if the abort signal has been triggered.
                            // Write the decoded data to the parser and terminate if there is an error.
                            parser.write(result.value, (error) => {
                                if (error) reject(tidyUp(connector, FAILED_TO_READ_MESSAGE, 'readConnectionEntry.4', error));
                            });
                        }
                        parser.end(); // Signal no more data will be written.
                    } catch (error) {
                        reject(tidyUp(connector, FAILED_TO_READ_MESSAGE, 'readConnectionEntry.3', error));
                    }
                })
                .catch((error) => reject(tidyUp(connector, FAILED_TO_READ_MESSAGE, 'readConnectionEntry.2', error)));
        } catch (error) {
            reject(tidyUp(connector, FAILED_TO_READ_MESSAGE, 'readConnectionEntry.1', error));
        }
    });
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// File Store Emulator Data Connector - Utilities
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const tidyUp = (connector: DataConnector | undefined, message: string, context: string, error: unknown): unknown => {
    if (connector) connector.abortController = undefined;
    if (error instanceof Error) error.stack = undefined;
    const connectorContextError = new ConnectorContextError(message, `${config.id}.${context}`, error);
    connectorContextError.stack = undefined;
    return connectorContextError;
};
