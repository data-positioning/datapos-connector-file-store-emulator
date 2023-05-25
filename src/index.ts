/**
 * @file datapos-connector-data-file-store-emulator/src/index.ts
 * @description The File Store Emulator data connector.
 * @license ISC Licensed under the ISC license, Version 2.0. See the LICENSE.md file for details.
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2023 Jonathan Terrell
 */

// Constants
const defaultChunkSize = 4096;
const urlPrefix = 'https://firebasestorage.googleapis.com/v0/b/datapos-v00-dev-alpha.appspot.com/o/fileStore';

// Dependencies - Asset
import config from './config.json';
import fileStoreIndex from './fileStoreIndex.json';
import { version } from '../package.json';

// Dependencies - Engine
import type {
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
    ErrorData,
    FieldInfos,
    SourceViewProperties
} from '@datapos/datapos-engine-support';
import {
    ConnectionEntryPreviewTypeId,
    ConnectionEntryTypeId,
    extractExtensionFromEntryPath,
    extractLastFolderNameFromFolderPath,
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
    async retrieveEntries(accountId: string, sessionAccessToken: string, parentConnectionEntry: ConnectionEntry): Promise<ConnectionEntriesPage> {
        return await retrieveEntries(parentConnectionEntry);
    }
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// File Store Emulator Data Connector - Retrieve Entries
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Retrieves entries based on the provided parent connection entry.
 * @param parentConnectionEntry - The parent connection entry.
 * @returns A promise that resolves to a page of connection entries.
 */
const retrieveEntries = (parentConnectionEntry: ConnectionEntry): Promise<ConnectionEntriesPage> => {
    return new Promise((resolve, reject) => {
        try {
            const folderPath = parentConnectionEntry.folderPath || '';

            const entries: ConnectionEntry[] = (fileStoreIndex as Record<string, unknown>)[folderPath] as ConnectionEntry[];
            console.log(1111, folderPath);
            console.log(2222, entries);
            console.log(3333, fileStoreIndex);
            resolve({ cursor: undefined, isMore: false, entries, totalCount: entries.length });
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Retrieves entries based on the provided parent connection entry.
 * @param parentConnectionEntry - The parent connection entry.
 * @returns A promise that resolves to a page of connection entries.
 */
const retrieveEntries2 = (parentConnectionEntry: ConnectionEntry): Promise<ConnectionEntriesPage> => {
    return new Promise((resolve, reject) => {
        try {
            const folderPath = parentConnectionEntry.folderPath || '';
            const entries: ConnectionEntry[] = [];
            if (folderPath.startsWith('/SAP Employee Central Extract')) {
                entries.push(buildFileEntry('/SAP Employee Central Extract', 'ADDRESS_INFO.csv', 208015));
                entries.push(buildFileEntry('/SAP Employee Central Extract', 'COMP_CUR_CONV.csv', 2245));
                entries.push(buildFileEntry('/SAP Employee Central Extract', 'EMP_COMP_INFO.csv', 1665179));
                entries.push(buildFileEntry('/SAP Employee Central Extract', 'EMP_PAYCOMP_RECURRING.csv', 1551764));
                entries.push(buildFileEntry('/SAP Employee Central Extract', 'EMPLOYMENT_INFO.csv', 128575));
                entries.push(buildFileEntry('/SAP Employee Central Extract', 'EVENT_REASONS.csv', 7775));
                entries.push(buildFileEntry('/SAP Employee Central Extract', 'FREQUENCY.csv', 1704));
                entries.push(buildFileEntry('/SAP Employee Central Extract', 'GENERIC_OBJECTS.csv', 1662477));
                entries.push(buildFileEntry('/SAP Employee Central Extract', 'GENERIC_RELATIONSHIPS.csv', 98782));
                entries.push(buildFileEntry('/SAP Employee Central Extract', 'JOB_CLASS.csv', 338260));
                entries.push(buildFileEntry('/SAP Employee Central Extract', 'JOB_INFO.csv', 1546379));
                entries.push(buildFileEntry('/SAP Employee Central Extract', 'LABELS.csv', 126838));
                entries.push(buildFileEntry('/SAP Employee Central Extract', 'LOCATIONS.csv', 2995));
                entries.push(buildFileEntry('/SAP Employee Central Extract', 'PAY_COMPONENT.csv', 1234));
                entries.push(buildFileEntry('/SAP Employee Central Extract', 'PERSON_INFO_GLOBAL.csv', 82438));
                entries.push(buildFileEntry('/SAP Employee Central Extract', 'PERSON.csv', 44896));
                entries.push(buildFileEntry('/SAP Employee Central Extract', 'PERSONAL_DATA.csv', 105949));
                entries.push(buildFileEntry('/SAP Employee Central Extract', 'PICKLISTS.csv', 78044));
                entries.push(buildFileEntry('/SAP Employee Central Extract', 'TERRITORY.csv', 8541));
            } else if (folderPath.startsWith('/Test Files')) {
                entries.push(buildFolderEntry('/Encoding', 21));
            } else if (folderPath.startsWith('/Encoding')) {
                entries.push(buildFileEntry('/Test Files/Encoding', 'big5', 614));
                entries.push(buildFileEntry('/Test Files/Encoding', 'euc-jp', 3919));
                entries.push(buildFileEntry('/Test Files/Encoding', 'euc-kr', 2480));
                entries.push(buildFileEntry('/Test Files/Encoding', 'gb18030', 1665));
                entries.push(buildFileEntry('/Test Files/Encoding', 'iso-2022-jp', 2924));
                entries.push(buildFileEntry('/Test Files/Encoding', 'iso-8859-2', 1600));
                entries.push(buildFileEntry('/Test Files/Encoding', 'iso-8859-5', 1024));
                entries.push(buildFileEntry('/Test Files/Encoding', 'iso-8859-6', 2241));
                entries.push(buildFileEntry('/Test Files/Encoding', 'iso-8859-7', 1033));
                entries.push(buildFileEntry('/Test Files/Encoding', 'koi8-r', 1024));
                entries.push(buildFileEntry('/Test Files/Encoding', 'shift_jis', 2816));
                entries.push(buildFileEntry('/Test Files/Encoding', 'utf-16be', 1334));
                entries.push(buildFileEntry('/Test Files/Encoding', 'utf-16le', 1334));
                entries.push(buildFileEntry('/Test Files/Encoding', 'utf-8', 1125));
                entries.push(buildFileEntry('/Test Files/Encoding', 'windows-1250', 1617));
                entries.push(buildFileEntry('/Test Files/Encoding', 'windows-1251', 1024));
                entries.push(buildFileEntry('/Test Files/Encoding', 'windows-1252', 2976));
                entries.push(buildFileEntry('/Test Files/Encoding', 'windows-1253', 1052));
                entries.push(buildFileEntry('/Test Files/Encoding', 'windows-1254', 2445));
                entries.push(buildFileEntry('/Test Files/Encoding', 'windows-1255', 2405));
                entries.push(buildFileEntry('/Test Files/Encoding', 'windows-1256', 2241));
            } else {
                entries.push(buildFolderEntry('/SAP Employee Central Extract', 19));
                entries.push(buildFolderEntry('/Test Files', 7));
            }
            resolve({ cursor: undefined, isMore: false, entries, totalCount: entries.length });
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Builds a folder entry object with the specified folder path and child entry count.
 * @param folderPath - The path of the folder.
 * @param childEntryCount - The number of child entries in the folder.
 * @returns The constructed folder entry object.
 */

const buildFolderEntry = (folderPath: string, childEntryCount: number): ConnectionEntry => {
    const lastFolderName = extractLastFolderNameFromFolderPath(folderPath);
    return {
        childEntryCount,
        folderPath,
        encodingId: undefined,
        extension: undefined,
        handle: undefined,
        id: undefined,
        label: lastFolderName,
        lastModifiedAt: undefined,
        mimeType: undefined,
        name: lastFolderName,
        referenceId: undefined,
        size: undefined,
        typeId: ConnectionEntryTypeId.Folder
    };
};

/**
 * Builds a file entry object with the specified folder path, name, and size.
 * @param folderPath - The path of the folder containing the file.
 * @param name - The name of the file.
 * @param size - The size of the file in bytes.
 * @returns The constructed file entry object.
 */
const buildFileEntry = (folderPath: string, name: string, size: number): ConnectionEntry => {
    const extension = extractExtensionFromEntryPath(name);
    return {
        childEntryCount: undefined,
        folderPath,
        encodingId: undefined,
        extension,
        handle: undefined,
        id: name,
        label: name,
        lastModifiedAt: Date.parse('2022-01-03T23:33:00+00:00'),
        mimeType: lookupMimeTypeForFileExtension(extension),
        name,
        referenceId: undefined,
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
const previewFileEntry = async (
    connector: DataConnector,
    sourceViewProperties: SourceViewProperties,
    accountId: string | undefined,
    sessionAccessToken: string | undefined,
    previewInterfaceSettings: DataConnectorPreviewInterfaceSettings
): Promise<ConnectionEntryPreview> => {
    connector.abortController = new AbortController();
    const signal = connector.abortController.signal;
    // TODO: signal.addEventListener('abort', () => console.log('TRACE: Preview File Entry ABORTED!'), { once: true, signal }); // Don't need once and signal?

    const headers: HeadersInit = {
        Range: `bytes=0-${previewInterfaceSettings.chunkSize || defaultChunkSize}`
    };
    const response = await fetch(`${urlPrefix}${encodeURIComponent(`${sourceViewProperties.folderPath}/${sourceViewProperties.fileName}`)}?alt=media`, { headers, signal });
    connector.abortController = undefined;
    if (!response.ok) {
        const data: ErrorData = {
            body: { context: 'previewFileEntry', message: await response.text() },
            statusCode: response.status,
            statusText: response.statusText
        };
        throw new Error('Unable to preview entry.|' + JSON.stringify(data));
    }
    const uint8Array = new Uint8Array(await response.arrayBuffer());

    return { data: uint8Array, fields: undefined, typeId: ConnectionEntryPreviewTypeId.Uint8Array };
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
