/**
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2022 Jonathan Terrell
 * @file dataposapp-connector-data-sample-files/src/index.ts
 * @license ISC
 */

// Asset dependencies.
import config from './config.json';
import env from '../.env.json';
import { version } from '../package.json';

// Engine component dependencies.
import {
    ConnectionElement,
    ConnectionElementPreview,
    ConnectionElementPreviewTypeId,
    ConnectionElementsPage,
    ConnectionElementTypeId,
    ConnectionItem,
    DataConnector,
    DataConnectorPreviewInterface,
    DataConnectorPreviewInterfaceSettings,
    DataConnectorReadInterface,
    DataConnectorReadInterfaceSettings,
    ErrorData,
    extractExtensionFromElementPath,
    extractLastDirectoryNameFromDirectoryPath,
    lookupMimeTypeForFileExtension,
    SourceViewProperties
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
        return { connector: this, previewFileElement };
    }

    /**
     * Get the sample files read interface.
     * @returns The sample files read interface.
     */
    getReadInterface(): DataConnectorReadInterface {
        return { connector: this, readFileElement };
    }

    /**
     * List a page of elements for a given directory path.
     * @param accountId The identifier of the account to which the source belongs.
     * @param sessionAccessToken An active session access token.
     * @param directoryPath The directory path for which to list the elements.
     * @returns A page of elements.
     */
    async listPageOfElementsForDirectoryPath(accountId: string, sessionAccessToken: string, directoryPath: string): Promise<ConnectionElementsPage> {
        return await listPageOfElementsForDirectoryPath(directoryPath);
    }
}

// #endregion

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// region List Page of Elements for Directory Path
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * List a page of sample file elements for a given directory path.
 * @param directoryPath The directory path for which to list the elements.
 * @returns A page of sample file elements.
 */
const listPageOfElementsForDirectoryPath = (directoryPath: string): Promise<ConnectionElementsPage> => {
    return new Promise((resolve, reject) => {
        try {
            const elements: ConnectionElement[] = [];
            if (directoryPath.startsWith('/SAP Employee Central Extract')) {
                elements.push(buildFileElement('/SAP Employee Central Extract', 'ADDRESS_INFO.csv', 208015));
                elements.push(buildFileElement('/SAP Employee Central Extract', 'COMP_CUR_CONV.csv', 2245));
                elements.push(buildFileElement('/SAP Employee Central Extract', 'EMP_COMP_INFO.csv', 1665179));
                elements.push(buildFileElement('/SAP Employee Central Extract', 'EMP_PAYCOMP_RECURRING.csv', 1551764));
                elements.push(buildFileElement('/SAP Employee Central Extract', 'EMPLOYMENT_INFO.csv', 128575));
                elements.push(buildFileElement('/SAP Employee Central Extract', 'EVENT_REASONS.csv', 7775));
                elements.push(buildFileElement('/SAP Employee Central Extract', 'FREQUENCY.csv', 1704));
                elements.push(buildFileElement('/SAP Employee Central Extract', 'GENERIC_OBJECTS.csv', 1662477));
                elements.push(buildFileElement('/SAP Employee Central Extract', 'GENERIC_RELATIONSHIPS.csv', 98782));
                elements.push(buildFileElement('/SAP Employee Central Extract', 'JOB_CLASS.csv', 338260));
                elements.push(buildFileElement('/SAP Employee Central Extract', 'JOB_INFO.csv', 1546379));
                elements.push(buildFileElement('/SAP Employee Central Extract', 'LABELS.csv', 126838));
                elements.push(buildFileElement('/SAP Employee Central Extract', 'LOCATIONS.csv', 2995));
                elements.push(buildFileElement('/SAP Employee Central Extract', 'PAY_COMPONENT.csv', 1234));
                elements.push(buildFileElement('/SAP Employee Central Extract', 'PERSON_INFO_GLOBAL.csv', 82438));
                elements.push(buildFileElement('/SAP Employee Central Extract', 'PERSON.csv', 44896));
                elements.push(buildFileElement('/SAP Employee Central Extract', 'PERSONAL_DATA.csv', 105949));
                elements.push(buildFileElement('/SAP Employee Central Extract', 'PICKLISTS.csv', 78044));
                elements.push(buildFileElement('/SAP Employee Central Extract', 'TERRITORY.csv', 8541));
            } else if (directoryPath.startsWith('/Test Files')) {
                elements.push(buildFolderElement('/Encoding', 21));
            } else if (directoryPath.startsWith('/Encoding')) {
                elements.push(buildFileElement('/Test Files/Encoding', 'big5', 614));
                elements.push(buildFileElement('/Test Files/Encoding', 'euc-jp', 3919));
                elements.push(buildFileElement('/Test Files/Encoding', 'euc-kr', 2480));
                elements.push(buildFileElement('/Test Files/Encoding', 'gb18030', 1665));
                elements.push(buildFileElement('/Test Files/Encoding', 'iso-2022-jp', 2924));
                elements.push(buildFileElement('/Test Files/Encoding', 'iso-8859-2', 1600));
                elements.push(buildFileElement('/Test Files/Encoding', 'iso-8859-5', 1024));
                elements.push(buildFileElement('/Test Files/Encoding', 'iso-8859-6', 2241));
                elements.push(buildFileElement('/Test Files/Encoding', 'iso-8859-7', 1033));
                elements.push(buildFileElement('/Test Files/Encoding', 'koi8-r', 1024));
                elements.push(buildFileElement('/Test Files/Encoding', 'shift_jis', 2816));
                elements.push(buildFileElement('/Test Files/Encoding', 'utf-16be', 1334));
                elements.push(buildFileElement('/Test Files/Encoding', 'utf-16le', 1334));
                elements.push(buildFileElement('/Test Files/Encoding', 'utf-8', 1125));
                elements.push(buildFileElement('/Test Files/Encoding', 'windows-1250', 1617));
                elements.push(buildFileElement('/Test Files/Encoding', 'windows-1251', 1024));
                elements.push(buildFileElement('/Test Files/Encoding', 'windows-1252', 2976));
                elements.push(buildFileElement('/Test Files/Encoding', 'windows-1253', 1052));
                elements.push(buildFileElement('/Test Files/Encoding', 'windows-1254', 2445));
                elements.push(buildFileElement('/Test Files/Encoding', 'windows-1255', 2405));
                elements.push(buildFileElement('/Test Files/Encoding', 'windows-1256', 2241));
            } else {
                elements.push(buildFolderElement('/SAP Employee Central Extract', 19));
                elements.push(buildFolderElement('/Test Files', 7));
            }
            resolve({ cursor: undefined, isMore: false, elements });
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Build a 'Sample Files' folder element.
 * @param directoryPath The folder element directory path.
 * @param childElementCount The folder element child element count.
 * @returns A 'Sample Files' folder element.
 */
const buildFolderElement = (directoryPath: string, childElementCount: number): ConnectionElement => {
    const lastDirectoryName = extractLastDirectoryNameFromDirectoryPath(directoryPath);
    return {
        _id: undefined,
        childElementCount,
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
        typeId: ConnectionElementTypeId.Folder
    };
};

/**
 * Build a 'Sample Files' file element.
 * @param directoryPath The file element directory path.
 * @param name The file element name.
 * @param size The file element size.
 * @returns A 'Sample Files' file element.
 */
const buildFileElement = (directoryPath: string, name: string, size: number): ConnectionElement => {
    const extension = extractExtensionFromElementPath(name);
    return {
        _id: undefined,
        childElementCount: undefined,
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
        typeId: ConnectionElementTypeId.File
    };
};

// #endregion

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// #region Preview File Element
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Preview a Sample Files file element.
 * @param connector This sample files data connector.
 * @param sourceViewProperties The source view properties.
 * @param accountId The identifier of the account to which the source belongs.
 * @param sessionAccessToken An active session token.
 * @param previewInterfaceSettings The preview interface settings.
 * @param connectionElement
 * @returns A source file element preview.
 */
const previewFileElement = async (
    connector: DataConnector,
    sourceViewProperties: SourceViewProperties,
    accountId: string | undefined,
    sessionAccessToken: string | undefined,
    previewInterfaceSettings: DataConnectorPreviewInterfaceSettings,
    connectionElement: ConnectionElement
): Promise<ConnectionElementPreview> => {
    const headers: HeadersInit = {
        Range: `bytes=0-${previewInterfaceSettings.chunkSize || defaultChunkSize}`
    };
    const response = await fetch(`${env.SAMPLE_FILES_URL_PREFIX}${encodeURIComponent(`${connectionElement.directoryPath}/${connectionElement.name}`)}?alt=media`, { headers });
    if (!response.ok) {
        const data: ErrorData = {
            body: { context: 'previewFileElement', message: await response.text() },
            statusCode: response.status,
            statusText: response.statusText
        };
        throw new Error('Unable to preview element.|' + JSON.stringify(data));
    }

    const uint8Array = new Uint8Array(await response.arrayBuffer());
    return { data: uint8Array, typeId: ConnectionElementPreviewTypeId.Uint8Array };
};

// #endregion

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// #region Read File Element
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Read a Sample Files file element.
 * @param connector The Dropbox data connector.
 * @param sourceViewProperties The source view properties.
 * @param accountId The identifier of the account to which the source belongs.
 * @param sessionAccessToken An active session token.
 * @param readInterfaceSettings The read interface settings.
 * @param connectionElement
 * @param csvParse The csv-parse library.
 */
const readFileElement = async (
    connector: DataConnector,
    sourceViewProperties: SourceViewProperties,
    accountId: string,
    sessionAccessToken: string,
    readInterfaceSettings: DataConnectorReadInterfaceSettings,
    connectionElement: ConnectionElement,
    csvParse: typeof import('csv-parse/browser/esm')
): Promise<void> => {
    const response = await fetch(`${env.SAMPLE_FILES_URL_PREFIX}${encodeURIComponent(`${connectionElement.directoryPath}/${connectionElement.name}`)}?alt=media`);

    const parser = csvParse.parse({
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
