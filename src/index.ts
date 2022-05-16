/**
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2022 Jonathan Terrell
 * @file dataposapp-connector-data-sample-files/src/index.ts
 * @license ISC
 */

// TODO:
//  1.  Implement read interface.

// Asset dependencies.
import config from './config.json';
import env from '../.env.json';
import { version } from '../package.json';

// Engine component dependencies.
import {
    ConnectionItem,
    DataConnector,
    DataConnectorPreviewInterface,
    DataConnectorPreviewInterfaceSettings,
    DataConnectorReadInterface,
    DataConnectorReadInterfaceSettings,
    ErrorData,
    extractExtensionFromItemPath,
    extractLastDirectoryNameFromDirectoryPath,
    lookupDataMimeType,
    SourceDataItemPreview,
    SourceDataItemPreviewTypeId,
    SourceItem,
    SourceItemsPage,
    SourceItemTypeId,
    SourceViewProperties
} from '../../../../dataposapp-engine-components/src';

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
        return { connector: this, previewDataItem };
    }

    /**
     * Get the sample files read interface.
     * @returns The sample files read interface.
     */
    getReadInterface(): DataConnectorReadInterface {
        return { connector: this, readDataItem };
    }

    /**
     * List a page of items for a given directory path.
     * @param accountId The identifier of the account to which the source belongs.
     * @param sessionAccessToken An active session access token.
     * @param directoryPath The directory path for which to list the items.
     * @returns A page of items.
     */
    async listPageOfItemsForDirectoryPath(accountId: string, sessionAccessToken: string, directoryPath: string): Promise<SourceItemsPage> {
        return await listPageOfItemsForDirectoryPath(directoryPath);
    }
}

// #endregion

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// region List Page of Items for Directory Path
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * List a page of sample file items for a given directory path.
 * @param directoryPath The directory path for which to list the items.
 * @returns A page of sample file items.
 */
const listPageOfItemsForDirectoryPath = (directoryPath: string): Promise<SourceItemsPage> => {
    return new Promise((resolve, reject) => {
        try {
            const items: SourceItem[] = [];
            if (directoryPath.startsWith('/SAP Employee Central Extract')) {
                items.push(buildDataItem('/SAP Employee Central Extract', 'ADDRESS_INFO.csv', 208015));
                items.push(buildDataItem('/SAP Employee Central Extract', 'COMP_CUR_CONV.csv', 2245));
                items.push(buildDataItem('/SAP Employee Central Extract', 'EMP_COMP_INFO.csv', 1665179));
                items.push(buildDataItem('/SAP Employee Central Extract', 'EMP_PAYCOMP_RECURRING.csv', 1551764));
                items.push(buildDataItem('/SAP Employee Central Extract', 'EMPLOYMENT_INFO.csv', 128575));
                items.push(buildDataItem('/SAP Employee Central Extract', 'EVENT_REASONS.csv', 7775));
                items.push(buildDataItem('/SAP Employee Central Extract', 'FREQUENCY.csv', 1704));
                items.push(buildDataItem('/SAP Employee Central Extract', 'GENERIC_OBJECTS.csv', 1662477));
                items.push(buildDataItem('/SAP Employee Central Extract', 'GENERIC_RELATIONSHIPS.csv', 98782));
                items.push(buildDataItem('/SAP Employee Central Extract', 'JOB_CLASS.csv', 338260));
                items.push(buildDataItem('/SAP Employee Central Extract', 'JOB_INFO.csv', 1546379));
                items.push(buildDataItem('/SAP Employee Central Extract', 'LABELS.csv', 126838));
                items.push(buildDataItem('/SAP Employee Central Extract', 'LOCATIONS.csv', 2995));
                items.push(buildDataItem('/SAP Employee Central Extract', 'PAY_COMPONENT.csv', 1234));
                items.push(buildDataItem('/SAP Employee Central Extract', 'PERSON_INFO_GLOBAL.csv', 82438));
                items.push(buildDataItem('/SAP Employee Central Extract', 'PERSON.csv', 44896));
                items.push(buildDataItem('/SAP Employee Central Extract', 'PERSONAL_DATA.csv', 105949));
                items.push(buildDataItem('/SAP Employee Central Extract', 'PICKLISTS.csv', 78044));
                items.push(buildDataItem('/SAP Employee Central Extract', 'TERRITORY.csv', 8541));
            } else if (directoryPath.startsWith('/Test Files')) {
                items.push(buildFolderItem('/Encoding', 21));
            } else if (directoryPath.startsWith('/Encoding')) {
                items.push(buildDataItem('/Test Files/Encoding', 'big5', 614));
                items.push(buildDataItem('/Test Files/Encoding', 'euc-jp', 3919));
                items.push(buildDataItem('/Test Files/Encoding', 'euc-kr', 2480));
                items.push(buildDataItem('/Test Files/Encoding', 'gb18030', 1665));
                items.push(buildDataItem('/Test Files/Encoding', 'iso-2022-jp', 2924));
                items.push(buildDataItem('/Test Files/Encoding', 'iso-8859-2', 1600));
                items.push(buildDataItem('/Test Files/Encoding', 'iso-8859-5', 1024));
                items.push(buildDataItem('/Test Files/Encoding', 'iso-8859-6', 2241));
                items.push(buildDataItem('/Test Files/Encoding', 'iso-8859-7', 1033));
                items.push(buildDataItem('/Test Files/Encoding', 'koi8-r', 1024));
                items.push(buildDataItem('/Test Files/Encoding', 'shift_jis', 2816));
                items.push(buildDataItem('/Test Files/Encoding', 'utf-16be', 1334));
                items.push(buildDataItem('/Test Files/Encoding', 'utf-16le', 1334));
                items.push(buildDataItem('/Test Files/Encoding', 'utf-8', 1125));
                items.push(buildDataItem('/Test Files/Encoding', 'windows-1250', 1617));
                items.push(buildDataItem('/Test Files/Encoding', 'windows-1251', 1024));
                items.push(buildDataItem('/Test Files/Encoding', 'windows-1252', 2976));
                items.push(buildDataItem('/Test Files/Encoding', 'windows-1253', 1052));
                items.push(buildDataItem('/Test Files/Encoding', 'windows-1254', 2445));
                items.push(buildDataItem('/Test Files/Encoding', 'windows-1255', 2405));
                items.push(buildDataItem('/Test Files/Encoding', 'windows-1256', 2241));
            } else {
                items.push(buildFolderItem('/SAP Employee Central Extract', 19));
                items.push(buildFolderItem('/Test Files', 7));
            }
            resolve({ cursor: undefined, isMore: false, items });
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Build a sample file folder item.
 * @param directoryPath The folder item directory path.
 * @param childItemCount The folder item child item count.
 * @returns A sample file folder item.
 */
const buildFolderItem = (directoryPath: string, childItemCount: number): SourceItem => {
    const lastDirectoryName = extractLastDirectoryNameFromDirectoryPath(directoryPath);
    return {
        _id: undefined,
        childItemCount,
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
        typeId: SourceItemTypeId.Folder
    };
};

/**
 * Build a sample file data item.
 * @param directoryPath The data item directory path.
 * @param name The data item name.
 * @param size The data item size.
 * @returns A sample file data item.
 */
const buildDataItem = (directoryPath: string, name: string, size: number): SourceItem => {
    const extension = extractExtensionFromItemPath(name);
    return {
        _id: undefined,
        childItemCount: undefined,
        directoryPath,
        encodingId: undefined,
        extension,
        id: name,
        insertedId: undefined,
        label: name,
        lastModifiedAt: Date.parse('2022-01-03T23:33:00+00:00'),
        mimeType: lookupDataMimeType(extension),
        name,
        referenceId: undefined,
        size,
        typeId: SourceItemTypeId.Data
    };
};

// #endregion

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// #region Preview Data Item
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Preview a sample file data item.
 * @param connector This sample files data connector.
 * @param accountId The identifier of the account to which the source belongs.
 * @param sessionAccessToken An active session token.
 * @param previewInterfaceSettings The preview interface settings.
 * @param sourceViewProperties The source view properties.
 * @returns A source data item preview.
 */
const previewDataItem = async (
    connector: DataConnector,
    accountId: string | undefined,
    sessionAccessToken: string | undefined,
    previewInterfaceSettings: DataConnectorPreviewInterfaceSettings,
    sourceViewProperties: SourceViewProperties
): Promise<SourceDataItemPreview> => {
    const headers: HeadersInit = {
        Range: `bytes=0-${previewInterfaceSettings.chunkSize || defaultChunkSize}`
    };
    console.log(`${env.SAMPLE_FILES_URL_PREFIX}${encodeURIComponent(sourceViewProperties.path)}?alt=media`);
    const response = await fetch(`${env.SAMPLE_FILES_URL_PREFIX}${encodeURIComponent(sourceViewProperties.path)}?alt=media`, { headers });
    if (!response.ok) {
        const data: ErrorData = {
            body: { context: 'previewDataItem', message: await response.text() },
            statusCode: response.status,
            statusText: response.statusText
        };
        throw new Error('Unable to preview item.|' + JSON.stringify(data));
    }

    const uint8Array = new Uint8Array(await response.arrayBuffer());
    return { data: uint8Array, typeId: SourceDataItemPreviewTypeId.Uint8Array };
};

// #endregion

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// #region Read Data Item
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 *
 * @param connector
 * @param accountId
 * @param sessionAccessToken
 * @param readInterfaceSettings
 * @param sourceViewProperties
 * @param csvParse
 */
const readDataItem = async (
    connector: DataConnector,
    accountId: string,
    sessionAccessToken: string,
    readInterfaceSettings: DataConnectorReadInterfaceSettings,
    sourceViewProperties: SourceViewProperties,
    csvParse: typeof import('csv-parse/browser/esm')
): Promise<void> => {
    const response = await fetch(`${env.SAMPLE_FILES_URL_PREFIX}${encodeURIComponent(sourceViewProperties.path)}?alt=media`);

    const parser = csvParse.parse({
        delimiter: ','
    });

    let totalRecordCount = 0;
    let chunk: string[][] = [];
    const maxChunkSize = 50;
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
    const stream = response.body?.pipeThrough(new TextDecoderStream('utf-8'));
    const streamReader = stream?.getReader();

    let result;
    while (!(result = await streamReader?.read()).done) {
        console.log(result.done, result.value ? result.value.length : 0);
        parser.write(result.value);
    }
    parser.end();
};

// #endregion
