const ABORTED_PREVIEW_MESSAGE = 'Aborted preview connection entry.';
const ABORTED_READ_MESSAGE = 'Aborted read connection entry.';
const DEFAULT_PREVIEW_CHUNK_SIZE = 4096;
const DEFAULT_READ_CHUNK_SIZE = 1000;
const FAILED_TO_READ_MESSAGE = 'Failed to read connection entry.';
const FAILED_TO_PREVIEW_MESSAGE = 'Failed to preview connection entry.';
const FAILED_TO_RETRIEVE_MESSAGE = 'Failed to retrieve connection entries.';
const URL_PREFIX = 'https://datapos-resources.netlify.app/';

import config from './config.json';
import fileStoreIndex from './fileStoreIndex.json';
import { version } from '../package.json';
import {
    AbortError,
    ConnectionEntryPreviewTypeId,
    ConnectionEntryTypeId,
    ConnectorContextError,
    extractFileExtensionFromFilePath,
    FetchResponseError,
    lookupMimeTypeForFileExtension
} from '@datapos/datapos-share-core';
import type { Callback, CastingContext, Options, Parser } from 'csv-parse';
import type {
    ConnectionConfig,
    ConnectionEntry,
    ConnectionEntryDrilldownResult,
    ConnectionEntryPreview,
    ConnectorCallbackData,
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
} from '@datapos/datapos-share-core';

type FileStoreIndex = Record<string, { childCount?: number; lastModifiedAt?: number; name: string; size?: number; typeId: string }[]>;

export default class FileStoreEmulatorDataConnector implements DataConnector {
    abortController: AbortController | undefined;
    readonly config: ConnectorConfig;
    readonly connectionConfig: ConnectionConfig;
    readonly version: string;

    constructor(connectionConfig: ConnectionConfig) {
        this.abortController = undefined;
        this.config = config as ConnectorConfig;
        this.connectionConfig = connectionConfig;
        this.version = version;
    }

    abort(): void {
        if (!this.abortController) return;
        this.abortController.abort();
        this.abortController = undefined;
    }

    getPreviewInterface(): DataConnectorPreviewInterface {
        return { connector: this, previewConnectionEntry };
    }

    getReadInterface(): DataConnectorReadInterface {
        return { connector: this, readConnectionEntry };
    }

    async retrieveConnectionEntries(
        accountId: string,
        sessionAccessToken: string,
        settings: DataConnectorRetrieveEntriesSettings,
        callback: (data: ConnectorCallbackData) => void
    ): Promise<ConnectionEntryDrilldownResult> {
        return new Promise((resolve, reject) => {
            try {
                callback({ typeId: 'test', properties: { aProp: 'value 1' } });
                const items = (fileStoreIndex as FileStoreIndex)[settings.folderPath];
                const entries: ConnectionEntry[] = [];
                for (const item of items) {
                    if (item.typeId === 'folder') {
                        entries.push(buildFolderEntry(settings.folderPath, item.name, item.childCount));
                    } else {
                        entries.push(buildFileEntry(settings.folderPath, item.name, item.lastModifiedAt, item.size));
                    }
                }
                callback({ typeId: 'test', properties: { aProp: 'value 2' } });
                resolve({ cursor: undefined, isMore: false, entries, totalCount: entries.length });
            } catch (error) {
                reject(tidyUp(undefined, FAILED_TO_RETRIEVE_MESSAGE, 'retrieveConnectionEntries.1', error));
            }
        });
    }
}

// Interfaces
const previewConnectionEntry = (
    connector: DataConnector,
    accountId: string | undefined,
    sessionAccessToken: string | undefined,
    sourceViewConfig: SourceViewConfig,
    previewInterfaceSettings: DataConnectorPreviewInterfaceSettings
    // callback: (data: ConnectorCallbackData) => void
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
            const url = `${URL_PREFIX}fileStore${sourceViewConfig.folderPath}/${fullFileName}`;
            const headers: HeadersInit = { Range: `bytes=0-${previewInterfaceSettings.chunkSize || DEFAULT_PREVIEW_CHUNK_SIZE}` };
            fetch(encodeURI(url), { headers, signal })
                .then(async (response) => {
                    try {
                        if (response.ok) {
                            const result = await response.arrayBuffer();
                            connector.abortController = undefined;
                            resolve({ data: new Uint8Array(result), typeId: ConnectionEntryPreviewTypeId.Uint8Array });
                        } else {
                            const error = new FetchResponseError(response.status, response.statusText, await response.text());
                            reject(tidyUp(connector, FAILED_TO_PREVIEW_MESSAGE, 'previewConnectionEntry.4', error));
                        }
                    } catch (error) {
                        reject(tidyUp(connector, FAILED_TO_PREVIEW_MESSAGE, 'previewConnectionEntry.3', error));
                    }
                })
                .catch((error) => reject(tidyUp(connector, FAILED_TO_PREVIEW_MESSAGE, 'previewConnectionEntry.2', error)));
        } catch (error) {
            reject(tidyUp(connector, FAILED_TO_PREVIEW_MESSAGE, 'previewConnectionEntry.1', error));
        }
    });
};

// Interfaces
const readConnectionEntry = (
    connector: DataConnector,
    accountId: string,
    sessionAccessToken: string,
    sourceViewConfig: SourceViewConfig,
    readInterfaceSettings: DataConnectorReadInterfaceSettings,
    csvParse: (options?: Options, callback?: Callback) => Parser // TODO: typeof import('csv-parse/browser/esm'). Keep just in case.
    // callback: (data: ConnectorCallbackData) => void
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
            const url = `${URL_PREFIX}fileStore${sourceViewConfig.folderPath}/${fullFileName}`;
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

// Utilities
const buildFolderEntry = (folderPath: string, name: string, childCount: number): ConnectionEntry => {
    return {
        childCount,
        folderPath,
        encodingId: undefined,
        extension: undefined,
        handle: undefined,
        id: undefined,
        label: name,
        lastModifiedAt: undefined,
        mimeType: undefined,
        name,
        referenceId: undefined,
        size: undefined,
        typeId: ConnectionEntryTypeId.Folder
    };
};

// Utilities
const buildFileEntry = (folderPath: string, name: string, lastModifiedAt: number, size: number): ConnectionEntry => {
    const extension = extractFileExtensionFromFilePath(name);
    return {
        childCount: undefined,
        folderPath,
        encodingId: undefined,
        extension,
        handle: undefined,
        id: undefined,
        label: name,
        lastModifiedAt,
        mimeType: lookupMimeTypeForFileExtension(extension),
        name,
        referenceId: undefined,
        size,
        typeId: ConnectionEntryTypeId.File
    };
};

// Utilities
const tidyUp = (connector: DataConnector | undefined, message: string, context: string, error: unknown): unknown => {
    if (connector) connector.abortController = undefined;
    if (error instanceof Error) error.stack = undefined;
    const connectorContextError = new ConnectorContextError(message, `${config.id}.${context}`, error);
    connectorContextError.stack = undefined;
    return connectorContextError;
};
