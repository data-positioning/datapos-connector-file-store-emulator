// TODO: Cloudflare R2 Download URL: https://plugins-eu.datapositioning.app/connectors/datapos-connector-file-store-emulator-es.js

// Dependencies - Vendor
import type { CastingContext } from 'csv-parse';

// Dependencies - Framework
import { AbortError, ConnectorError, FetchError } from '@datapos/datapos-share-core';
import type { ConnectionConfig, ConnectionItemConfig, Connector, ConnectorCallbackData, ConnectorConfig } from '@datapos/datapos-share-core';
import { convertMillisecondsToTimestamp, extractExtensionFromPath, extractNameFromPath, lookupMimeTypeForExtension } from '@datapos/datapos-share-core';
import type { FindResult, FindSettings } from '@datapos/datapos-share-core';
import type { ListResult, ListSettings } from '@datapos/datapos-share-core';
import type { DataViewPreviewConfig, PreviewInterface, PreviewResult, PreviewSettings } from '@datapos/datapos-share-core';
import type { RetrieveInterface, RetrieveRecord, RetrieveSettings } from '@datapos/datapos-share-core';

// Dependencies - Data
import config from './config.json';
import fileStoreIndex from './fileStoreIndex.json';
import { version } from '../package.json';

// Interfaces/Types - File Store Index
type FileStoreIndex = Record<string, { id?: string; childCount?: number; lastModifiedAt?: number; name: string; size?: number; typeId: string }[]>;

// Constants
const CALLBACK_PREVIEW_ABORTED = 'Connector preview aborted.';
const CALLBACK_READ_ABORTED = 'Connector read aborted.';
const DEFAULT_PREVIEW_CHUNK_SIZE = 4096;
const DEFAULT_READ_CHUNK_SIZE = 1000;
const ERROR_LIST_ITEMS_FAILED = 'Connector list items failed.';
const ERROR_PREVIEW_FAILED = 'Connector preview failed.';
const ERROR_READ_FAILED = 'Connector read failed.';
const URL_PREFIX = 'https://sampledata.datapos.app';

// Classes - File Store Emulator Connector
export default class FileStoreEmulatorConnector implements Connector {
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

    async find(findSettings: FindSettings): Promise<FindResult> {
        for (const folderPath in fileStoreIndex) {
            if (Object.prototype.hasOwnProperty.call(fileStoreIndex, folderPath)) {
                const indexItems = (fileStoreIndex as FileStoreIndex)[folderPath];
                const indexItem = indexItems.find((indexItem) => indexItem.typeId === 'object' && indexItem.id === findSettings.objectName);
                if (indexItem) return { folderPath };
            }
        }
        return {};
    }

    getPreviewInterface(): PreviewInterface {
        return { preview: this.preview };
    }

    getRetrieveInterface(): RetrieveInterface {
        return { retrieve: this.retrieve };
    }

    // Operations - List
    async list(settings: ListSettings): Promise<ListResult> {
        try {
            const indexItems = (fileStoreIndex as FileStoreIndex)[settings.folderPath];
            const connectionItemConfigs: ConnectionItemConfig[] = [];
            for (const indexItem of indexItems) {
                if (indexItem.typeId === 'folder') {
                    connectionItemConfigs.push(this.buildFolderItemConfig(settings.folderPath, indexItem.name, indexItem.childCount));
                } else {
                    connectionItemConfigs.push(this.buildObjectItemConfig(settings.folderPath, indexItem.id, indexItem.name, indexItem.lastModifiedAt, indexItem.size));
                }
            }
            return { cursor: undefined, isMore: false, connectionItemConfigs, totalCount: connectionItemConfigs.length };
        } catch (error) {
            throw this.constructErrorAndTidyUp(ERROR_LIST_ITEMS_FAILED, 'listItems.1', error);
        }
    }

    // Operations - Preview
    async preview(itemConfig: ConnectionItemConfig, settings: PreviewSettings): Promise<PreviewResult> {
        try {
            // Create an abort controller. Get the signal for the abort controller and add an abort listener.
            this.abortController = new AbortController();
            const signal = this.abortController.signal;
            signal.addEventListener('abort', () => {
                throw this.constructErrorAndTidyUp(ERROR_PREVIEW_FAILED, 'preview.2', new AbortError(CALLBACK_PREVIEW_ABORTED));
            });

            // Fetch chunk from start of file.
            const fullFileName = `${itemConfig.name}${itemConfig.extension ? `.${itemConfig.extension}` : ''}`;
            const url = `${URL_PREFIX}/fileStore${itemConfig.folderPath}${fullFileName}`;
            const headers: HeadersInit = { Range: `bytes=0-${settings.chunkSize || DEFAULT_PREVIEW_CHUNK_SIZE}` };
            const response = await fetch(encodeURI(url), { headers, signal });
            if (response.ok) {
                this.abortController = null;
                return { data: new Uint8Array(await response.arrayBuffer()), typeId: 'uint8Array' };
            } else {
                const message = `Connector preview failed to fetch '${itemConfig.folderPath}${itemConfig.name}' file. Response status ${response.status}${response.statusText ? ` - ${response.statusText}` : ''} received.`;
                const error = new FetchError(message, { locator: 'preview.3', body: await response.text() });
                throw this.constructErrorAndTidyUp(ERROR_PREVIEW_FAILED, 'preview.4', error);
            }
        } catch (error) {
            throw this.constructErrorAndTidyUp(ERROR_PREVIEW_FAILED, 'preview.1', error);
        }
    }

    // Operations - Retrieve
    private async retrieve(
        itemConfig: ConnectionItemConfig,
        previewConfig: DataViewPreviewConfig,
        settings: RetrieveSettings,
        callback: (data: ConnectorCallbackData) => void
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                callback({ typeId: 'start', properties: {} });
                // Create an abort controller and get the signal. Add an abort listener to the signal.
                this.abortController = new AbortController();
                const signal = this.abortController.signal;
                signal.addEventListener(
                    'abort',
                    () => reject(this.constructErrorAndTidyUp(ERROR_READ_FAILED, 'read.10', new AbortError(CALLBACK_READ_ABORTED)))
                    /*, { once: true, signal } TODO: Don't need once and signal? */
                );

                // Parser - Declare variables.
                let pendingRows: RetrieveRecord[] = []; // Array to store rows of parsed field values and associated information.
                const fieldQuotings: boolean[] = []; // Array to store field information for a single row.

                // Parser - Create a parser object for CSV parsing.
                const parser = settings.csvParse({
                    cast: (value, context) => {
                        fieldQuotings[context.index] = context.quoting;
                        return value;
                    },
                    delimiter: previewConfig.valueDelimiterId,
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
                            // TODO: Do we need to clear 'fieldInfos' array for each record? Different number of values in a row?
                            pendingRows.push({ fieldQuotings, fieldValues: data.record }); // Append the row of parsed values and associated information to the pending rows array.
                            if (pendingRows.length < DEFAULT_READ_CHUNK_SIZE) continue; // Continue with next iteration if the pending rows array is not yet full.
                            settings.chunk(pendingRows); // Pass the pending rows to the engine using the 'chunk' callback.
                            pendingRows = []; // Clear the pending rows array in preparation for the next batch of data.
                        }
                    } catch (error) {
                        reject(this.constructErrorAndTidyUp(ERROR_READ_FAILED, 'read.9', error));
                    }
                });

                // Parser - Event listener for the 'error' event.
                parser.on('error', (error) => reject(this.constructErrorAndTidyUp(ERROR_READ_FAILED, 'read.8', error)));

                // Parser - Event listener for the 'end' (end of data) event.
                parser.on('end', () => {
                    try {
                        signal.throwIfAborted(); // Check if the abort signal has been triggered.
                        this.abortController = null; // Clear the abort controller.
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
                        callback({ typeId: 'end', properties: {} });
                    } catch (error) {
                        reject(this.constructErrorAndTidyUp(ERROR_READ_FAILED, 'read.7', error));
                    }
                });

                // Fetch, decode and forward the contents of the file to the parser.
                const fullFileName = `${itemConfig.name}${itemConfig.extension ? `.${itemConfig.extension}` : ''}`;
                const url = `${URL_PREFIX}fileStore${itemConfig.folderPath}${fullFileName}`;
                fetch(encodeURI(url), { signal })
                    .then(async (response) => {
                        try {
                            if (response.ok) {
                                const stream = response.body.pipeThrough(new TextDecoderStream(previewConfig.encodingId));
                                const decodedStreamReader = stream.getReader();
                                let result;
                                while (!(result = await decodedStreamReader.read()).done) {
                                    signal.throwIfAborted(); // Check if the abort signal has been triggered.
                                    // Write the decoded data to the parser and terminate if there is an error.
                                    parser.write(result.value, (error) => {
                                        if (error) reject(this.constructErrorAndTidyUp(ERROR_READ_FAILED, 'read.2', error));
                                    });
                                }
                                parser.end(); // Signal no more data will be written.
                            } else {
                                const message = `Connector read failed to fetch '${itemConfig.folderPath}${itemConfig.name}' file. Response status ${response.status}${response.statusText ? ` - ${response.statusText}` : ''} received.`;
                                const error = new FetchError(message, { locator: 'read.3', body: await response.text() });
                                reject(this.constructErrorAndTidyUp(ERROR_READ_FAILED, 'read.4', error));
                            }
                        } catch (error) {
                            reject(this.constructErrorAndTidyUp(ERROR_READ_FAILED, 'read.5', error));
                        }
                    })
                    .catch((error) => reject(this.constructErrorAndTidyUp(ERROR_READ_FAILED, 'read.6', error)));
            } catch (error) {
                reject(this.constructErrorAndTidyUp(ERROR_READ_FAILED, 'read.1', error));
            }
        });
    }

    // Utilities - Build Folder Item Configuration
    private buildFolderItemConfig(folderPath: string, name: string, childCount: number): ConnectionItemConfig {
        return { childCount, folderPath, label: name, name, typeId: 'folder' };
    }

    // Utilities - Build Object (File) Item Configuration
    private buildObjectItemConfig(folderPath: string, id: string, fullName: string, lastModifiedAt: number, size: number): ConnectionItemConfig {
        const name = extractNameFromPath(fullName);
        const extension = extractExtensionFromPath(fullName);
        return {
            id,
            extension,
            folderPath,
            label: fullName,
            lastModifiedAt: convertMillisecondsToTimestamp(lastModifiedAt),
            mimeType: lookupMimeTypeForExtension(extension),
            name,
            size,
            typeId: 'object'
        };
    }

    // Utilities - Construct Error and Tidy Up
    private constructErrorAndTidyUp(message: string, context: string, error: unknown): ConnectorError {
        this.abortController = null;
        return new ConnectorError(message, { locator: `${config.id}.${context}` }, undefined, error);
    }
}
