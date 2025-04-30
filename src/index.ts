// TODO: Consider Cloudflare R2 Download URL: https://plugins-eu.datapositioning.app/connectors/datapos-connector-file-store-emulator-es.js. This would allow us to secure the bucket?

// Dependencies - Vendor
import type { CastingContext } from 'csv-parse';

// Dependencies - Framework
import { AbortError, FetchError } from '@datapos/datapos-share-core';
import type { ConnectionConfig, ConnectionItemConfig, Connector, ConnectorConfig } from '@datapos/datapos-share-core';
import { convertMillisecondsToTimestamp, extractExtensionFromPath, extractNameFromPath, lookupMimeTypeForExtension } from '@datapos/datapos-share-core';
import type { FindResult, FindSettings } from '@datapos/datapos-share-core';
import type { ListResult, ListSettings } from '@datapos/datapos-share-core';
import type { PreviewData, PreviewSettings } from '@datapos/datapos-share-core';
import type { RetrieveSettings, RetrieveSummary, RetrieveTools } from '@datapos/datapos-share-core';

// Dependencies - Data
import config from './config.json';
import fileStoreIndex from './fileStoreIndex.json';
import { version } from '../package.json';

// Interfaces/Types - File Store Index
type FileStoreIndex = Record<string, { id?: string; childCount?: number; lastModifiedAt?: number; name: string; size?: number; typeId: string }[]>;

// Constants
const CALLBACK_PREVIEW_ABORTED = 'Connector failed to abort preview object operation.';
const CALLBACK_RETRIEVE_ABORTED = 'Connector failed to abort retrieve all records operation.';
const DEFAULT_PREVIEW_CHUNK_SIZE = 4096;
const DEFAULT_RETRIEVE_CHUNK_SIZE = 1000;
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

    // Operations - Abort
    abort(connector: FileStoreEmulatorConnector): void {
        if (!connector.abortController) return;
        connector.abortController.abort();
        connector.abortController = null;
        return;
    }

    // Operations - Find
    async find(connector: FileStoreEmulatorConnector, settings: FindSettings): Promise<FindResult> {
        // Loop through the file store index checking for an item with an identifier equal to the object name.
        for (const folderPath in fileStoreIndex) {
            if (Object.prototype.hasOwnProperty.call(fileStoreIndex, folderPath)) {
                const indexItems = (fileStoreIndex as FileStoreIndex)[folderPath];
                const indexItem = indexItems.find((indexItem) => indexItem.typeId === 'object' && indexItem.id === settings.objectName);
                if (indexItem) return { folderPath }; // Found, return folder path.
            }
        }
        return {}; // Not found, return undefined folder path.
    }

    // Operations - List
    async list(connector: FileStoreEmulatorConnector, settings: ListSettings): Promise<ListResult> {
        const indexItems = (fileStoreIndex as FileStoreIndex)[settings.folderPath];
        const connectionItemConfigs: ConnectionItemConfig[] = [];
        for (const indexItem of indexItems) {
            if (indexItem.typeId === 'folder') {
                connectionItemConfigs.push(buildFolderItemConfig(settings.folderPath, indexItem.name, indexItem.childCount));
            } else {
                connectionItemConfigs.push(buildObjectItemConfig(settings.folderPath, indexItem.id, indexItem.name, indexItem.lastModifiedAt, indexItem.size));
            }
        }
        return { cursor: undefined, isMore: false, connectionItemConfigs, totalCount: connectionItemConfigs.length };
    }

    // Operations - Preview
    async preview(connector: FileStoreEmulatorConnector, settings: PreviewSettings): Promise<PreviewData> {
        try {
            // Create an abort controller. Get the signal for the abort controller and add an abort listener.
            connector.abortController = new AbortController();
            const signal = connector.abortController.signal;
            signal.addEventListener('abort', () => {
                throw new AbortError(CALLBACK_PREVIEW_ABORTED);
            });

            // Fetch chunk from start of file.
            const url = `${URL_PREFIX}/fileStore${settings.path}`;
            const headers: HeadersInit = { Range: `bytes=0-${settings.chunkSize || DEFAULT_PREVIEW_CHUNK_SIZE}` };
            const response = await fetch(encodeURI(url), { headers, signal });
            if (response.ok) {
                connector.abortController = null;
                return { data: new Uint8Array(await response.arrayBuffer()), typeId: 'uint8Array' };
            } else {
                const message = `Connector preview failed to fetch '${settings.path}' file. Response status ${response.status}${response.statusText ? ` - ${response.statusText}` : ''} received.`;
                const error = new FetchError(message, { locator: 'preview.3', body: await response.text() });
                throw error;
            }
        } catch (error) {
            connector.abortController = null;
            throw error;
        }
    }

    // Operations - Retrieve
    async retrieve(
        connector: FileStoreEmulatorConnector,
        settings: RetrieveSettings,
        chunk: (records: string[][]) => void,
        complete: (result: RetrieveSummary) => void,
        tools: RetrieveTools
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                console.log(1111, settings);
                // Create an abort controller and get the signal. Add an abort listener to the signal.
                connector.abortController = new AbortController();
                const signal = connector.abortController.signal;
                signal.addEventListener(
                    'abort',
                    () => {
                        connector.abortController = null;
                        reject(new AbortError(CALLBACK_RETRIEVE_ABORTED));
                    },
                    { once: true }
                );

                // Parser - Declare variables.
                let pendingRows: string[][] = []; // Array to store rows of parsed field values and associated information.
                // const fieldQuotings: boolean[] = []; // Array to store field information for a single row.

                // Parser - Create a parser object for CSV parsing.
                const parser = tools.csvParse({
                    // cast: (value, context) => {
                    //     fieldQuotings[context.index] = context.quoting;
                    //     return value;
                    // },
                    delimiter: settings.valueDelimiterId,
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
                            // pendingRows.push({ fieldQuotings, fieldValues: data.record }); // Append the row of parsed values and associated information to the pending rows array.
                            pendingRows.push(data.record); // Append the row of parsed values and associated information to the pending rows array.
                            // fieldQuotings.length = 0;
                            if (pendingRows.length < DEFAULT_RETRIEVE_CHUNK_SIZE) continue; // Continue with next iteration if the pending rows array is not yet full.
                            chunk(pendingRows); // Pass the pending rows to the engine using the 'chunk' callback.
                            pendingRows = []; // Clear the pending rows array in preparation for the next batch of data.
                        }
                    } catch (error) {
                        connector.abortController = null;
                        reject(error);
                    }
                });

                // Parser - Event listener for the 'error' event.
                parser.on('error', (error) => {
                    connector.abortController = null;
                    reject(error);
                });

                // Parser - Event listener for the 'end' (end of data) event.
                parser.on('end', () => {
                    try {
                        signal.throwIfAborted(); // Check if the abort signal has been triggered.
                        connector.abortController = null; // Clear the abort controller.
                        if (pendingRows.length > 0) {
                            chunk(pendingRows);
                            pendingRows = [];
                        }
                        complete({
                            byteCount: parser.info.bytes,
                            commentLineCount: parser.info.comment_lines,
                            emptyLineCount: parser.info.empty_lines,
                            invalidFieldLengthCount: parser.info.invalid_field_length,
                            lineCount: parser.info.lines,
                            recordCount: parser.info.records
                        });
                        resolve();
                    } catch (error) {
                        connector.abortController = null;
                        reject(error);
                    }
                });

                // Fetch, decode and forward the contents of the file to the parser.
                const url = `${URL_PREFIX}/fileStore${settings.path}`;
                fetch(encodeURI(url), { signal })
                    .then(async (response) => {
                        try {
                            if (response.ok) {
                                const stream = response.body.pipeThrough(new TextDecoderStream(settings.encodingId));
                                const decodedStreamReader = stream.getReader();
                                let result;
                                while (!(result = await decodedStreamReader.read()).done) {
                                    signal.throwIfAborted(); // Check if the abort signal has been triggered.
                                    // Write the decoded data to the parser and terminate if there is an error.
                                    parser.write(result.value, (error) => {
                                        if (error) {
                                            connector.abortController = null;
                                            reject(error);
                                        }
                                    });
                                }
                                parser.end(); // Signal no more data will be written.
                            } else {
                                const message = `Connector retrieve failed to fetch '${settings.path}' file. Response status ${response.status}${response.statusText ? ` - ${response.statusText}` : ''} received.`;
                                const error = new FetchError(message, { locator: 'retrieve.7', body: await response.text() });
                                connector.abortController = null;
                                reject(error);
                            }
                        } catch (error) {
                            connector.abortController = null;
                            reject(error);
                        }
                    })
                    .catch((error) => {
                        connector.abortController = null;
                        reject(error);
                    });
            } catch (error) {
                connector.abortController = null;
                reject(error);
            }
        });
    }
}

// Utilities - Build Folder Item Configuration
function buildFolderItemConfig(folderPath: string, name: string, childCount: number): ConnectionItemConfig {
    return { childCount, folderPath, label: name, name, typeId: 'folder' };
}

// Utilities - Build Object (File) Item Configuration
function buildObjectItemConfig(folderPath: string, id: string, fullName: string, lastModifiedAt: number, size: number): ConnectionItemConfig {
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
