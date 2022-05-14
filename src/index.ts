/**
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2022 Jonathan Terrell
 * @file src/index.ts
 * @license "ISC"
 */

// TODO
//  1.  Review the need for language encoding test files.
//  2.  Enter sizes and last modified dates for all sample files.
//  3.  Implement read interface.
//  4.  Check the SAP Employee Central files are all encoded as UTF-8;

// Connector asset dependencies.
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
    extractLastDirectoryNameFromDirectoryPath,
    SourceItem,
    SourceItemsPage,
    SourceItemTypeId,
    SourceDataItemPreview,
    SourceDataItemPreviewTypeId,
    SourceViewProperties
} from '../../../../dataposapp-engine-components/src';

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Declarations
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const defaultChunkSize = 4096;

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Connector
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
        throw new Error('Not implemented');
    }

    /**
     * List a page of source items for a given directory path.
     * @param accountId The identifier of the account to which the source belongs.
     * @param sessionAccessToken An active session access token.
     * @param directoryPath The directory path for which to list the items.
     * @returns A page of source items.
     */
    async listPageOfItemsForDirectoryPath(accountId: string, _sessionAccessToken: string, directoryPath: string): Promise<SourceItemsPage> {
        return await listPageOfItemsForDirectoryPath(directoryPath);
    }
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Preview Data Item
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * Preview a sample file data item.
 * @param thisConnector The sample files data connector.
 * @param accountId The identifier of the account to which the source belongs.
 * @param sessionAccessToken An active session token.
 * @param previewInterfaceSettings The preview interface settings.
 * @param sourceViewProperties The source view properties.
 * @returns A source data item preview.
 */
const previewDataItem = async (
    thisConnector: DataConnector,
    accountId: string | undefined,
    sessionAccessToken: string | undefined,
    previewInterfaceSettings: DataConnectorPreviewInterfaceSettings,
    sourceViewProperties: SourceViewProperties
): Promise<SourceDataItemPreview> => {
    const headers: HeadersInit = {
        Range: `bytes=0-${previewInterfaceSettings.chunkSize || defaultChunkSize}`
    };
    const response = await fetch(`${env.SAMPLE_FILES_URL_PREFIX}${encodeURIComponent(sourceViewProperties.path)}?alt=media`, { headers });
    if (!response.ok) throw new Error('|' + (await response.text()));

    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    return { data: uint8Array, typeId: SourceDataItemPreviewTypeId.Uint8Array };
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// List Page of Items for Directory Path
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * List a page of source items for a given directory path.
 * @param directoryPath The directory path for which to list the items.
 * @returns A page of sample source items.
 */
const listPageOfItemsForDirectoryPath = (directoryPath: string): Promise<SourceItemsPage> => {
    return new Promise((resolve, reject) => {
        try {
            const items: SourceItem[] = [];
            if (directoryPath.startsWith('/SAP Employee Central')) {
                items.push(buildDataItem('/SAP Employee Central', 'ADDRESS_INFO.csv', 'text/csv', 208015, '2018-01-02T23:33:00+00:00'));
                items.push(buildDataItem('/SAP Employee Central', 'COMP_CUR_CONV.csv', 'text/csv', 2245, '2018-01-02T23:33:00+00:00'));
                items.push(buildDataItem('/SAP Employee Central', 'EMP_COMP_INFO.csv', 'text/csv', 1665179, '2018-01-02T23:33:00+00:00'));
                items.push(buildDataItem('/SAP Employee Central', 'EMP_PAYCOMP_RECURRING.csv', 'text/csv', 1551764, '2018-01-02T23:33:00+00:00'));
                items.push(buildDataItem('/SAP Employee Central', 'EMPLOYMENT_INFO.csv', 'text/csv', 128575, '2018-01-02T23:33:00+00:00'));
                items.push(buildDataItem('/SAP Employee Central', 'EVENT_REASONS.csv', 'text/csv', 7775, '2018-01-02T23:33:00+00:00'));
                items.push(buildDataItem('/SAP Employee Central', 'FREQUENCY.csv', 'text/csv', 1704, '2018-01-02T23:33:00+00:00'));
                items.push(buildDataItem('/SAP Employee Central', 'GENERIC_OBJECTS.csv', 'text/csv', 1662477, '2018-01-02T23:33:00+00:00'));
                items.push(buildDataItem('/SAP Employee Central', 'GENERIC_RELATIONSHIPS.csv', 'text/csv', 98782, '2018-01-02T23:33:00+00:00'));
                items.push(buildDataItem('/SAP Employee Central', 'JOB_CLASS.csv', 'text/csv', 338260, '2018-01-02T23:33:00+00:00'));
                items.push(buildDataItem('/SAP Employee Central', 'JOB_INFO.csv', 'text/csv', 1546379, '2018-01-02T23:33:00+00:00'));
                items.push(buildDataItem('/SAP Employee Central', 'LABELS.csv', 'text/csv', 126838, '2018-01-02T23:33:00+00:00'));
                items.push(buildDataItem('/SAP Employee Central', 'LOCATIONS.csv', 'text/csv', 2995, '2018-01-02T23:33:00+00:00'));
                items.push(buildDataItem('/SAP Employee Central', 'PAY_COMPONENT.csv', 'text/csv', 1234, '2018-01-02T23:33:00+00:00'));
                items.push(buildDataItem('/SAP Employee Central', 'PERSON_INFO_GLOBAL.csv', 'text/csv', 82438, '2018-01-02T23:33:00+00:00'));
                items.push(buildDataItem('/SAP Employee Central', 'PERSON.csv', 'text/csv', 44896, '2018-01-02T23:33:00+00:00'));
                items.push(buildDataItem('/SAP Employee Central', 'PERSONAL_DATA.csv', 'text/csv', 105949, '2018-01-02T23:33:00+00:00'));
                items.push(buildDataItem('/SAP Employee Central', 'PICKLISTS.csv', 'text/csv', 78044, '2018-01-02T23:33:00+00:00'));
                items.push(buildDataItem('/SAP Employee Central', 'TERRITORY.csv', 'text/csv', 8541, '2018-01-02T23:33:00+00:00'));
            } else if (directoryPath.startsWith('/Test Files')) {
                items.push(buildFolderItem('/Encoding', 30));
            } else if (directoryPath.startsWith('/Encoding')) {
                items.push(buildDataItem('/Test Files/Encoding', 'big5', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'euc_jp', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'euc_kr', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'gb18030', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'iso2022jp', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'iso88592_cs', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'iso88595_ru', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'iso88596_ar', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'iso88597_el', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'koi8r', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'lang_arabic', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'lang_chinese', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'lang_czech', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'lang_greek', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'lang_hebrew', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'lang_japanese', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'lang_korean', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'lang_russian', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'lang_turkish', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'shiftjis', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'utf16be', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'utf16le', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'utf8', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'windows_1250', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'windows_1251', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'windows_1252', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'windows_1253', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'windows_1254', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'windows_1255', 'text/plain', undefined, undefined));
                items.push(buildDataItem('/Test Files/Encoding', 'windows_1256', 'text/plain', undefined, undefined));
            } else {
                items.push(buildFolderItem('/SAP Employee Central', 19));
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
 * @param lastModifiedAtString The data item last modified date.
 * @returns A sample file data item.
 */
const buildDataItem = (directoryPath: string, name: string, mimeType: string, size: number, lastModifiedAtString: string): SourceItem => ({
    _id: undefined,
    childItemCount: undefined,
    directoryPath,
    encodingId: undefined,
    extension: 'csv',
    id: name,
    insertedId: undefined,
    label: name,
    lastModifiedAt: Date.parse(lastModifiedAtString),
    mimeType,
    name,
    referenceId: undefined,
    size,
    typeId: SourceItemTypeId.Data
});
