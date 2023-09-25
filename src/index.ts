import config from './config.json';
import fileStoreIndex from './fileStoreIndex.json';
import { version } from '../package.json';
import type { Callback, CastingContext, Options, Parser } from 'csv-parse';

import { AbortError, ConnectorContextError, FetchResponseError, ListEntryPreviewTypeId, ListEntryTypeId } from '@datapos/datapos-share-core';
import type { ConnectionConfig, ConnectorCallbackData, ConnectorConfig, DataConnector, DataConnectorFieldInfo, DataConnectorRecord } from '@datapos/datapos-share-core';
import { extractFileExtensionFromFilePath, lookupMimeTypeForFileExtension } from '@datapos/datapos-share-core';
import type { ListEntriesSettings, ListEntry, ListEntryDrilldownResult, ListEntryPreview } from '@datapos/datapos-share-core';
import type { PreviewInterface, PreviewInterfaceSettings, ReadInterface, ReadInterfaceSettings, SourceViewConfig } from '@datapos/datapos-share-core';

// Constants
const CALLBACK_PREVIEW_ABORTED = 'Aborted entry preview.';
const CALLBACK_READ_ABORTED = 'Aborted entry read.';
const DEFAULT_PREVIEW_CHUNK_SIZE = 4096;
const DEFAULT_READ_CHUNK_SIZE = 1000;
const ERROR_LIST_ENTRIES_FAILED = 'Failed to list entries.';
const ERROR_READ_ENTRY_FAILED = 'Failed to read entry.';
const ERROR_PREVIEW_ENTRY_FAILED = 'Failed to preview entry.';
const URL_PREFIX = 'https://datapos-resources.netlify.app/';

// Declarations
type FileStoreIndex = Record<string, { childCount?: number; lastModifiedAt?: number; name: string; size?: number; typeId: string }[]>;

// Classes
export default class FileStoreEmulatorDataConnector implements DataConnector {
    abortController: AbortController | undefined;
    readonly config: ConnectorConfig;
    readonly connectionConfig: ConnectionConfig;

    constructor(connectionConfig: ConnectionConfig) {
        this.abortController = null;
        this.config = config as ConnectorConfig;
        this.config.version = version;
        this.connectionConfig = connectionConfig;
    }

    abort(): void {
        if (!this.abortController) return;
        this.abortController.abort();
        this.abortController = null;
    }

    getPreviewInterface(): PreviewInterface {
        return { connector: this, previewEntry };
    }

    getReadInterface(): ReadInterface {
        return { connector: this, readEntry };
    }

    async listEntries(settings: ListEntriesSettings): Promise<ListEntryDrilldownResult> {
        return new Promise((resolve, reject) => {
            try {
                const indexEntries = (fileStoreIndex as FileStoreIndex)[settings.folderPath];
                const listEntries: ListEntry[] = [];
                for (const indexEntry of indexEntries) {
                    if (indexEntry.typeId === 'folder') {
                        listEntries.push(buildFolderEntry(settings.folderPath, indexEntry.name, indexEntry.childCount));
                    } else {
                        listEntries.push(buildFileEntry(settings.folderPath, indexEntry.name, indexEntry.lastModifiedAt, indexEntry.size));
                    }
                }
                resolve({ cursor: undefined, isMore: false, entries: listEntries, totalCount: listEntries.length });
            } catch (error) {
                reject(tidyUp(undefined, ERROR_LIST_ENTRIES_FAILED, 'listEntries.1', error));
            }
        });
    }
}

// Interfaces - Preview Entry
const previewEntry = (connector: DataConnector, sourceViewConfig: SourceViewConfig, settings: PreviewInterfaceSettings): Promise<ListEntryPreview> => {
    console.log('X1', connector, sourceViewConfig, settings);
    return new Promise((resolve, reject) => {
        try {
            // Create an abort controller. Get the signal for the abort controller and add an abort listener.
            connector.abortController = new AbortController();
            const signal = connector.abortController.signal;
            signal.addEventListener('abort', () => reject(tidyUp(connector, ERROR_PREVIEW_ENTRY_FAILED, 'previewEntry.5', new AbortError(CALLBACK_PREVIEW_ABORTED))));

            // Fetch chunk from start of file.
            const url = `${URL_PREFIX}fileStore${sourceViewConfig.folderPath}/${sourceViewConfig.fileName}`;
            const headers: HeadersInit = { Range: `bytes=0-${settings.chunkSize || DEFAULT_PREVIEW_CHUNK_SIZE}` };
            console.log('X2', url, headers);
            fetch(encodeURI(url), { headers, signal })
                .then(async (response) => {
                    try {
                        connector.abortController = null;
                        if (response.ok) {
                            resolve({ data: new Uint8Array(await response.arrayBuffer()), typeId: ListEntryPreviewTypeId.Uint8Array });
                        } else {
                            const error = new FetchResponseError(response.status, response.statusText, await response.text());
                            reject(tidyUp(connector, ERROR_PREVIEW_ENTRY_FAILED, 'previewEntry.4', error));
                        }
                    } catch (error) {
                        reject(tidyUp(connector, ERROR_PREVIEW_ENTRY_FAILED, 'previewEntry.3', error));
                    }
                })
                .catch((error) => reject(tidyUp(connector, ERROR_PREVIEW_ENTRY_FAILED, 'previewEntry.2', error)));
        } catch (error) {
            reject(tidyUp(connector, ERROR_PREVIEW_ENTRY_FAILED, 'previewEntry.1', error));
        }
    });
};

// Interfaces - Read Entry
const readEntry = (
    connector: DataConnector,
    sourceViewConfig: SourceViewConfig,
    settings: ReadInterfaceSettings,
    csvParse: (options?: Options, callback?: Callback) => Parser,
    callback: (data: ConnectorCallbackData) => void
): Promise<void> => {
    console.log('Y1', connector, sourceViewConfig, settings);
    return new Promise((resolve, reject) => {
        try {
            callback({ typeId: 'start', properties: { sourceViewConfig, settings } });
            // Create an abort controller and get the signal. Add an abort listener to the signal.
            connector.abortController = new AbortController();
            const signal = connector.abortController.signal;
            signal.addEventListener(
                'abort',
                () => reject(tidyUp(connector, ERROR_READ_ENTRY_FAILED, 'readEntry.8', new AbortError(CALLBACK_READ_ABORTED)))
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
                        settings.chunk(pendingRows); // Pass the pending rows to the engine using the 'chunk' callback.
                        pendingRows = []; // Clear the pending rows array in preparation for the next batch of data.
                    }
                } catch (error) {
                    reject(tidyUp(connector, ERROR_READ_ENTRY_FAILED, 'readEntry.7', error));
                }
            });

            // Parser - Event listener for the 'error' event.
            parser.on('error', (error) => reject(tidyUp(connector, ERROR_READ_ENTRY_FAILED, 'readEntry.6', error)));

            // Parser - Event listener for the 'end' (end of data) event.
            parser.on('end', () => {
                try {
                    signal.throwIfAborted(); // Check if the abort signal has been triggered.
                    connector.abortController = null; // Clear the abort controller.
                    if (pendingRows.length > 0) {
                        settings.chunk(pendingRows);
                        pendingRows = [];
                    }
                    settings.complete({
                        byteCount: parser.info.bytes,
                        commentLineCount: parser.info.comment_lines,
                        emptyLineCount: parser.info.empty_lines,
                        invalidFieldLengthCount: parser.info.invalid_field_length,
                        lineCount: parser.info.lines,
                        recordCount: parser.info.records
                    });
                    resolve();
                } catch (error) {
                    reject(tidyUp(connector, ERROR_READ_ENTRY_FAILED, 'readEntry.5', error));
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
                                if (error) reject(tidyUp(connector, ERROR_READ_ENTRY_FAILED, 'readEntry.4', error));
                            });
                        }
                        parser.end(); // Signal no more data will be written.
                    } catch (error) {
                        reject(tidyUp(connector, ERROR_READ_ENTRY_FAILED, 'readEntry.3', error));
                    }
                })
                .catch((error) => reject(tidyUp(connector, ERROR_READ_ENTRY_FAILED, 'readEntry.2', error)));
            callback({ typeId: 'end', properties: { url } });
        } catch (error) {
            reject(tidyUp(connector, ERROR_READ_ENTRY_FAILED, 'readEntry.1', error));
        }
    });
};

// Utilities - Build Folder Entry
const buildFolderEntry = (folderPath: string, name: string, childCount: number): ListEntry => {
    return {
        childCount,
        folderPath,
        encodingId: undefined,
        extension: undefined,
        handle: undefined,
        label: name,
        lastModifiedAt: undefined,
        mimeType: undefined,
        name,
        size: undefined,
        typeId: ListEntryTypeId.Folder
    };
};

// Utilities - Build File Entry
const buildFileEntry = (folderPath: string, name: string, lastModifiedAt: number, size: number): ListEntry => {
    const extension = extractFileExtensionFromFilePath(name);
    return {
        childCount: undefined,
        folderPath,
        encodingId: undefined,
        extension,
        handle: undefined,
        label: name,
        lastModifiedAt,
        mimeType: lookupMimeTypeForFileExtension(extension),
        name,
        size,
        typeId: ListEntryTypeId.File
    };
};

// Utilities - Tidy Up
const tidyUp = (connector: DataConnector | undefined, message: string, context: string, error: unknown): unknown => {
    if (connector) connector.abortController = null;
    if (error instanceof Error) error.stack = undefined;
    const connectorContextError = new ConnectorContextError(message, `${config.id}.${context}`, error);
    connectorContextError.stack = undefined;
    return connectorContextError;
};
