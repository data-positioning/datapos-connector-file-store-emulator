/**
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2022 Jonathan Terrell
 * @file dataposapp-connector-data-file-store-emulator/src/index.ts
 * @license ISC
 */

// Asset dependencies.
import config from './config.json';
import env from '../.env.json';
import { version } from '../package.json';

// Engine component dependencies.
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
    ErrorData,
    extractExtensionFromEntryPath,
    extractLastDirectoryNameFromDirectoryPath,
    lookupMimeTypeForFileExtension,
    SourceViewProperties,
    Environment
} from '../../../../dataposapp-engine-main/src';

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// #region Declarations
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const defaultChunkSize = 4096;

// #endregion

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// #region Data Connector
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Encapsulates the sample files data connector.
 */
export default class SampleFilesDataConnector implements DataConnector {
    connectionItem: ConnectionItem;
    id: string;
    isAborted: boolean;
    version: string;

    constructor(connectionItem: ConnectionItem) {
        this.connectionItem = connectionItem;
        this.id = config.id;
        this.isAborted = false;
        this.version = version;
    }

    /**
     * Get the sample files preview interface.
     * @returns The sample files preview interface.
     */
    getPreviewInterface(): DataConnectorPreviewInterface {
        return { connector: this, previewFileEntry };
    }

    /**
     * Get the sample files read interface.
     * @returns The sample files read interface.
     */
    getReadInterface(): DataConnectorReadInterface {
        return { connector: this, readFileEntry };
    }

    /**
     * List a page of entries for a given directory path.
     * @param accountId The identifier of the account to which the source belongs.
     * @param sessionAccessToken An active session access token.
     * @param directoryPath The directory path for which to list the entries.
     * @returns A page of entries.
     */
    async listEntries(accountId: string, sessionAccessToken: string, directoryPath: string): Promise<ConnectionEntriesPage> {
        return await listEntries(directoryPath);
    }
}

// #endregion

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// region List Page of Entries for Directory Path
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * List a page of sample file entries for a given directory path.
 * @param directoryPath The directory path for which to list the entries.
 * @returns A page of sample file entries.
 */
const listEntries = (directoryPath: string): Promise<ConnectionEntriesPage> => {
    return new Promise((resolve, reject) => {
        try {
            const entries: ConnectionEntry[] = [];
            if (directoryPath.startsWith('/SAP Employee Central Extract')) {
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
            } else if (directoryPath.startsWith('/Test Files')) {
                entries.push(buildFolderEntry('/Encoding', 21));
            } else if (directoryPath.startsWith('/Encoding')) {
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
            resolve({ cursor: undefined, isMore: false, entries });
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Build a 'Sample Files' folder entry.
 * @param directoryPath The folder entry directory path.
 * @param childEntryCount The folder entry child entry count.
 * @returns A 'Sample Files' folder entry.
 */
const buildFolderEntry = (directoryPath: string, childEntryCount: number): ConnectionEntry => {
    const lastDirectoryName = extractLastDirectoryNameFromDirectoryPath(directoryPath);
    return {
        _id: undefined,
        childEntryCount,
        directoryPath,
        encodingId: undefined,
        extension: undefined,
        id: undefined,
        insertedId: undefined,
        label: lastDirectoryName,
        lastModifiedAt: undefined,
        mimeType: undefined,
        name: lastDirectoryName,
        referenceId: undefined,
        size: undefined,
        typeId: ConnectionEntryTypeId.Folder
    };
};

/**
 * Build a 'Sample Files' file entry.
 * @param directoryPath The file entry directory path.
 * @param name The file entry name.
 * @param size The file entry size.
 * @returns A 'Sample Files' file entry.
 */
const buildFileEntry = (directoryPath: string, name: string, size: number): ConnectionEntry => {
    const extension = extractExtensionFromEntryPath(name);
    return {
        _id: undefined,
        childEntryCount: undefined,
        directoryPath,
        encodingId: undefined,
        extension,
        id: name,
        insertedId: undefined,
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
 * Preview a Sample Files file entry.
 * @param connector This sample files data connector.
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
    previewInterfaceSettings: DataConnectorPreviewInterfaceSettings,
    // connectionEntry: ConnectionEntry
): Promise<ConnectionEntryPreview> => {
    const headers: HeadersInit = {
        Range: `bytes=0-${previewInterfaceSettings.chunkSize || defaultChunkSize}`
    };

    const response = await fetch(`${env.SAMPLE_FILES_URL_PREFIX}${encodeURIComponent(`${sourceViewProperties.fileDirectoryPath}/${sourceViewProperties.fileName}`)}?alt=media`, { headers });
    if (!response.ok) {
        const data: ErrorData = {
            body: { context: 'previewFileEntry', message: await response.text() },
            statusCode: response.status,
            statusText: response.statusText
        };
        throw new Error('Unable to preview entry.|' + JSON.stringify(data));
    }

    const uint8Array = new Uint8Array(await response.arrayBuffer());
    return { data: uint8Array, typeId: ConnectionEntryPreviewTypeId.Uint8Array };
};

// #endregion

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// #region Read File Entry
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Read a Sample Files file entry.
 * @param connector The Dropbox data connector.
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
    // connectionEntry: ConnectionEntry,
    environment: Environment
): Promise<void> => {
    const response = await fetch(`${env.SAMPLE_FILES_URL_PREFIX}${encodeURIComponent(`${sourceViewProperties.fileDirectoryPath}/${sourceViewProperties.fileName}`)}?alt=media`);

    const parser = environment.csvParse.parse({
        delimiter: ','
    });

    let totalRecordCount = 0;
    let chunk: string[][] = [];
    const maxChunkSize = 1000;
    parser.on('readable', () => {
        let record;
        while ((record = parser.read() as string[]) !== null) {
            chunk.push(record);
            totalRecordCount++;
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
        readInterfaceSettings.complete({ totalRecordCount });
    });
    const stream = response.body.pipeThrough(new TextDecoderStream(sourceViewProperties.preview.encodingId));
    const streamReader = stream.getReader();
    let result;
    while (!(result = await streamReader.read()).done) parser.write(result.value);

    parser.end();
};

// #endregion
