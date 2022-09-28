/**
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2022 Jonathan Terrell
 * @file dataposapp-connector-data-file-store-emulator/src/index.ts
 * @license ISC
 */

// Asset dependencies.
import config from './config.json';
import { version } from '../package.json';

// Engine dependencies.
import {
    ConnectionEntry,
    ConnectionEntryPreview,
    ConnectionEntryPreviewTypeId,
    ConnectionEntriesPage,
    ConnectionEntryTypeId,
    ConnectionItem,
    DataConnector,
    DataConnectorPreviewInterface,
    DataConnectorPreviewInterfaceSettings,
    DataConnectorReadInterface,
    DataConnectorReadInterfaceSettings,
    Environment,
    ErrorData,
    extractExtensionFromEntryPath,
    extractLastFolderNameFromFolderPath,
    FieldInfos,
    ListEntriesProperties,
    lookupMimeTypeForFileExtension,
    SourceViewProperties
} from '../../../../dataposapp-engine-main/src';

// Vendor dependencies.
import type { CastingContext } from 'csv-parse/.';

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// #region Declarations
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const defaultChunkSize = 4096;
const urlPrefix = 'https://firebasestorage.googleapis.com/v0/b/dataposapp-v00-dev-alpha.appspot.com/o/fileStore';

// #endregion

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// #region Data Connector
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Encapsulates the file store emulator data connector.
 */
export default class FileStoreEmulatorDataConnector implements DataConnector {
    readonly connectionItem: ConnectionItem;
    readonly id: string;
    readonly isAborted: boolean;
    readonly version: string;

    constructor(connectionItem: ConnectionItem) {
        this.connectionItem = connectionItem;
        this.id = config.id;
        this.isAborted = false;
        this.version = version;
    }

    /**
     * Get the preview interface.
     * @returns The preview interface.
     */
    getPreviewInterface(): DataConnectorPreviewInterface {
        return { connector: this, previewFileEntry };
    }

    /**
     * Get the read interface.
     * @returns The read interface.
     */
    getReadInterface(): DataConnectorReadInterface {
        return { connector: this, readFileEntry };
    }

    /**
     * List a page of entries for a given folder path.
     * @param accountId The identifier of the account to which the source belongs.
     * @param sessionAccessToken An active session access token.
     * @param parentConnectionEntry
     * @returns A page of entries.
     */
    async listEntries(accountId: string, sessionAccessToken: string, parentConnectionEntry: ConnectionEntry, properties: ListEntriesProperties): Promise<ConnectionEntriesPage> {
        return await listEntries(parentConnectionEntry);
    }

    /**
     *
     */
    signal(): void {
        console.log('I WAS SIGNALED');
    }
}

// #endregion

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// #region List Entries
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * List a page of entries for a given folder path.
 * @param parentConnectionEntry
 * @returns A page of entries.
 */
const listEntries = (parentConnectionEntry: ConnectionEntry): Promise<ConnectionEntriesPage> => {
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

            console.log('SLEEPING');
            sleep(10000)
                .then(() => {
                    console.log('AWAKE');
                    resolve({ cursor: undefined, isMore: false, entries, totalCount: entries.length });
                })
                .catch((error) => {
                    console.log('ERROR', error);
                });
        } catch (error) {
            reject(error);
        }
    });
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Build a folder entry.
 * @param folderPath The folder entry folder path.
 * @param childEntryCount The folder entry child entry count.
 * @returns A folder entry.
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
 * Build a file entry.
 * @param folderPath The file entry folder path.
 * @param name The file entry name.
 * @param size The file entry size.
 * @returns A file entry.
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

// #endregion

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// #region Preview File Entry
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
    const headers: HeadersInit = {
        Range: `bytes=0-${previewInterfaceSettings.chunkSize || defaultChunkSize}`
    };
    const response = await fetch(`${urlPrefix}${encodeURIComponent(`${sourceViewProperties.folderPath}/${sourceViewProperties.fileName}`)}?alt=media`, {
        headers
    });
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

// #endregion

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// #region Read File Entry
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Read a file entry.
 * @param connector This data connector.
 * @param sourceViewProperties The source view properties.
 * @param accountId The identifier of the account to which the source belongs.
 * @param sessionAccessToken An active session token.
 * @param readInterfaceSettings The read interface settings.
 * @param environment
 */
const readFileEntry = async (
    connector: DataConnector,
    sourceViewProperties: SourceViewProperties,
    accountId: string,
    sessionAccessToken: string,
    readInterfaceSettings: DataConnectorReadInterfaceSettings,
    environment: Environment
): Promise<void> => {
    const response = await fetch(`${urlPrefix}${encodeURIComponent(`${sourceViewProperties.folderPath}/${sourceViewProperties.fileName}`)}?alt=media`);

    let chunk: { fieldInfos: FieldInfos[]; fieldValues: string[] }[] = [];
    const fieldInfos: FieldInfos[] = [];
    const maxChunkSize = 1000;

    // TODO: csvParse seems to have some support for encoding. Need to test if this can be used to replace TextDecoderStream?.
    const stream = response.body.pipeThrough(new TextDecoderStream(sourceViewProperties.preview.encodingId));
    const decodedStreamReader = stream.getReader();

    const parser = environment.csvParse.parse({
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
            chunk.push({ fieldInfos, fieldValues: data.record });
            if (chunk.length < maxChunkSize) continue;
            readInterfaceSettings.chunk(chunk);
            chunk = [];
        }
    });
    parser.on('error', (error) => readInterfaceSettings.error(error));
    parser.on('end', () => {
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

    let result;
    while (!(result = await decodedStreamReader.read()).done) parser.write(result.value);

    parser.end();
};

// #endregion
