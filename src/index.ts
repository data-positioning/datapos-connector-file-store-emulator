/**
 * @file datapos-connector-data-file-store-emulator/src/index.ts
 * @description The File Store Emulator data connector.
 * @license ISC Licensed under the ISC license, Version 2.0. See the LICENSE.md file for details.
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2023 Jonathan Terrell
 */

// Constants
const defaultChunkSize = 4096;
const urlPrefix = 'https://datapos-resources.netlify.app/';

// Dependencies - Asset
import config from './config.json';
import fileStoreIndex from './fileStoreIndex.json';
import { version } from '../package.json';

// Dependencies - Engine
import {
    ConnectionConfig,
    ConnectionEntriesPage,
    ConnectionEntry,
    ConnectionEntryPreview,
    ConnectorConfig,
    DataConnector,
    DataConnectorPreviewInterface,
    DataConnectorPreviewInterfaceSettings,
    DataConnectorReadInterface,
    DataConnectorReadInterfaceSettings,
    DataConnectorRetrieveEntriesSettings,
    FetchResponseError,
    FieldInfos,
    SourceViewProperties
} from '@datapos/datapos-engine-support';
import {
    ConnectionEntryPreviewTypeId,
    ConnectionEntryTypeId,
    extractFileExtensionFromFilePath,
    extractFileNameFromFilePath,
    extractLastSegmentFromPath,
    lookupMimeTypeForFileExtension
} from '@datapos/datapos-engine-support';

// Dependencies - Framework/Vendor
import type { CastingContext } from 'csv-parse/.';

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// File Store Emulator Data Connector
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export default class FileStoreEmulatorDataConnector implements DataConnector {
    abortController: AbortController | undefined;
    readonly config: ConnectorConfig;
    readonly connectionConfig: ConnectionConfig;
    readonly id: string;
    readonly version: string;

    constructor(connectionConfig: ConnectionConfig) {
        this.abortController = undefined;
        this.config = config as unknown as ConnectorConfig;
        console.log('config', config);
        this.connectionConfig = connectionConfig;
        this.id = config.id;
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
        return { connector: this, previewFileEntry };
    }

    /**
     * Retrieves the read interface for the data connector.
     * @returns The read interface object.
     */
    getReadInterface(): DataConnectorReadInterface {
        return { connector: this, readFileEntry };
    }

    /**
     * Retrieves a page of entries for a given account, using the provided session access token and parent connection entry.
     * @param accountId - The ID of the account.
     * @param sessionAccessToken - The session access token.
     * @param parentConnectionEntry - The parent connection entry.
     * @returns A promise that resolves to a page of connection entries.
     */
    async retrieveEntries(accountId: string, sessionAccessToken: string, settings: DataConnectorRetrieveEntriesSettings): Promise<ConnectionEntriesPage> {
        return await retrieveEntries(settings.folderPath);
    }
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// File Store Emulator Data Connector - Retrieve Entries
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Retrieves child connection entries based on a parent connection entry.
 * @param parentConnectionEntry - The parent connection entry.
 * @returns A promise that resolves to a ConnectionEntriesPage object.
 */
const retrieveEntries = (folderPath: string): Promise<ConnectionEntriesPage> => {
    return new Promise((resolve, reject) => {
        try {
            const items = (fileStoreIndex as Record<string, { lastModifiedAt?: number; path: string; size?: number; typeId: string }[]>)[folderPath];
            const entries: ConnectionEntry[] = [];
            for (const item of items) {
                if (item.typeId === 'folder') {
                    entries.push(buildFolderEntry(item.path, 0));
                } else {
                    entries.push(buildFileEntry(folderPath, item.path, item.lastModifiedAt, item.size));
                }
            }
            resolve({ cursor: undefined, isMore: false, entries, totalCount: entries.length });
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Builds a ConnectionEntry object representing a folder.
 * @param folderPath - The path of the folder.
 * @param childCount - The number of child entries in the folder.
 * @returns A ConnectionEntry object representing the folder.
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
        // referenceId: undefined,
        size: undefined,
        typeId: ConnectionEntryTypeId.Folder
    };
};

/**
 * Builds a ConnectionEntry object representing a file.
 * @param folderPath - The folder path of the file.
 * @param filePath - The path of the file.
 * @param lastModifiedAt - The moment the file was last modified.
 * @param size - The size of the file.
 * @returns A ConnectionEntry object representing the file.
 */
const buildFileEntry = (folderPath: string, filePath: string, lastModifiedAt: number, size: number): ConnectionEntry => {
    // const folderPath = extractFolderPathFromFilePath(filePath);
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
        // referenceId: undefined,
        size,
        typeId: ConnectionEntryTypeId.File
    };
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// File Store Emulator Data Connector - Preview File Entry
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Preview a file entry.
 * @param connector This data connector.
 * @param sourceViewProperties The source view properties.
 * @param accountId The identifier of the account to which the source belongs.
 * @param sessionAccessToken An active session token.
 * @param previewInterfaceSettings The preview interface settings.
 * @returns A source file entry preview.
 */
const previewFileEntry = (
    connector: DataConnector,
    sourceViewProperties: SourceViewProperties,
    accountId: string | undefined,
    sessionAccessToken: string | undefined,
    previewInterfaceSettings: DataConnectorPreviewInterfaceSettings
): Promise<ConnectionEntryPreview> => {
    return new Promise((resolve, reject) => {
        try {
            const fullFileName = `${sourceViewProperties.fileName}${sourceViewProperties.fileExtension ? `.${sourceViewProperties.fileExtension}` : ''}`;
            const url = `https://datapos-resources.netlify.app/fileStore${sourceViewProperties.folderPath}/${fullFileName}`;
            console.log('URL', url);
            const headers: HeadersInit = {
                Range: `bytes=0-${previewInterfaceSettings.chunkSize || defaultChunkSize}`
            };
            connector.abortController = new AbortController();
            const signal = connector.abortController.signal;
            // TODO: signal.addEventListener('abort', () => console.log('TRACE: Preview File Entry ABORTED!'), { once: true, signal }); // Don't need once and signal?
            fetch(encodeURI(url), { headers, signal })
                .then(async (response) => {
                    if (response.ok) return response.arrayBuffer();
                    throw new FetchResponseError(`${config.id}.previewFileEntry.1`, response.status, response.statusText, await response.text());
                })
                .then((result) => {
                    connector.abortController = undefined;
                    resolve({ data: new Uint8Array(result), fields: undefined, typeId: ConnectionEntryPreviewTypeId.Uint8Array });
                })
                .catch((error) => reject(error));
        } catch (error) {
            reject(error);
        }
    });
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// File Store Emulator Data Connector - Read File Entry
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Read a file entry.
 * @param connector This data connector.
 * @param sourceViewProperties The source view properties.
 * @param accountId The identifier of the account to which the source belongs.
 * @param sessionAccessToken An active session token.
 * @param readInterfaceSettings The read interface settings.
 * @param csvParse
 */
const readFileEntry = async (
    connector: DataConnector,
    sourceViewProperties: SourceViewProperties,
    accountId: string,
    sessionAccessToken: string,
    readInterfaceSettings: DataConnectorReadInterfaceSettings,
    csvParse: typeof import('csv-parse/browser/esm')
): Promise<void> => {
    connector.abortController = new AbortController();
    const signal = connector.abortController.signal;
    // TODO: signal.addEventListener('abort', () => console.log('TRACE: Read File Entry ABORTED!'), { once: true, signal }); // Don't need once and signal?

    const response = await fetch(`${urlPrefix}${encodeURIComponent(`${sourceViewProperties.folderPath}/${sourceViewProperties.fileName}`)}?alt=media`, { signal });

    let chunk: { fieldInfos: FieldInfos[]; fieldValues: string[] }[] = [];
    const fieldInfos: FieldInfos[] = [];
    const maxChunkSize = 1000;
    signal.throwIfAborted();
    const parser = csvParse.parse({
        cast: (value, context) => {
            fieldInfos[context.index] = { isQuoted: context.quoting };
            return value;
        },
        delimiter: sourceViewProperties.preview.valueDelimiterId,
        info: true,
        relax_column_count: true,
        relax_quotes: true
    });
    parser.on('readable', () => {
        let data;
        while ((data = parser.read() as { info: CastingContext; record: string[] }) !== null) {
            signal.throwIfAborted();
            chunk.push({ fieldInfos, fieldValues: data.record });
            if (chunk.length < maxChunkSize) continue;
            readInterfaceSettings.chunk(chunk);
            chunk = [];
        }
    });
    parser.on('error', (error) => readInterfaceSettings.error(error));
    parser.on('end', () => {
        signal.throwIfAborted();
        connector.abortController = undefined;
        if (chunk.length > 0) {
            readInterfaceSettings.chunk(chunk);
            chunk = [];
        }
        readInterfaceSettings.complete({
            commentLineCount: parser.info.comment_lines,
            emptyLineCount: parser.info.empty_lines,
            lineCount: parser.info.lines,
            recordCount: parser.info.records
        });
    });

    // TODO: csvParse seems to have some support for encoding. Need to test if this can be used to replace TextDecoderStream?.
    const stream = response.body.pipeThrough(new TextDecoderStream(sourceViewProperties.preview.encodingId));
    const decodedStreamReader = stream.getReader();
    let result;
    while (!(result = await decodedStreamReader.read()).done) {
        signal.throwIfAborted();
        parser.write(result.value, (error) => {
            if (error) readInterfaceSettings.error(error);
        });
    }
    parser.end();
};
