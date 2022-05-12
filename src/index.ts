/**
 * @author Jonathan Terrell <terrell.jm@gmail.com>
 * @copyright 2022 Jonathan Terrell
 * @file src/index.ts
 * @license "ISC"
 */

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
    SourceItemPreview,
    SourceItemPreviewTypeId,
    SourceItemsPage,
    SourceItemTypeId,
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
     *
     * @returns
     */
    getPreviewInterface(): DataConnectorPreviewInterface {
        return { connector: this, previewItem };
    }

    /**
     *
     */
    getReadInterface(): DataConnectorReadInterface {
        throw new Error('Not implemented');
    }

    /**
     * List a page of source items for a given directory path.
     * @param _accountId The identifier of the account to which the source belongs.
     * @param _sessionAccessToken An active session access token.
     * @param directoryPath The directory path for which to list the items.
     * @returns A page of source items.
     */
    async listPageOfItemsForDirectoryPath(_accountId: string, _sessionAccessToken: string, directoryPath: string): Promise<SourceItemsPage> {
        return await listPageOfItemsForDirectoryPath(directoryPath);
    }
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Preview Item
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 *
 * @param _thisConnector
 * @param _accountId
 * @param _sessionAccessToken
 * @param previewInterfaceSettings
 * @param sourceViewProperties
 * @returns
 */
const previewItem = async (
    _thisConnector: DataConnector,
    _accountId: string | undefined,
    _sessionAccessToken: string | undefined,
    previewInterfaceSettings: DataConnectorPreviewInterfaceSettings,
    sourceViewProperties: SourceViewProperties
): Promise<SourceItemPreview> => {
    const headers: HeadersInit = {
        Range: `bytes=0-${previewInterfaceSettings.chunkSize || defaultChunkSize}`
    };
    const response = await fetch(`${env.SAMPLE_FILES_URL_PREFIX}${encodeURIComponent(sourceViewProperties.path)}?alt=media`, { headers });
    if (!response.ok) throw new Error('|' + (await response.text()));
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    return { data: uint8Array, typeId: SourceItemPreviewTypeId.Uint8Array };
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// List Page of Items for Directory Path
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * List a page of source items for a given directory path.
 * @param directoryPath The directory path for which to list the items.
 * @returns A page of source items.
 */
const listPageOfItemsForDirectoryPath = (directoryPath: string): Promise<SourceItemsPage> => {
    return new Promise((resolve, reject) => {
        try {
            const items: SourceItem[] = [];
            if (directoryPath.startsWith('/SAP Employee Central')) {
                items.push(buildObjectItem('/SAP Employee Central', 'ADDRESS_INFO.csv', 'utf-8', 208015, '2018-01-02T23:33:00+00:00'));
                items.push(buildObjectItem('/SAP Employee Central', 'COMP_CUR_CONV.csv', 'utf-8', 2245, '2018-01-02T23:33:00+00:00'));
                items.push(buildObjectItem('/SAP Employee Central', 'EMP_COMP_INFO.csv', 'utf-8', 1665179, '2018-01-02T23:33:00+00:00'));
                items.push(buildObjectItem('/SAP Employee Central', 'EMP_PAYCOMP_RECURRING.csv', 'utf-8', 1551764, '2018-01-02T23:33:00+00:00'));
                items.push(buildObjectItem('/SAP Employee Central', 'EMPLOYMENT_INFO.csv', 'utf-8', 128575, '2018-01-02T23:33:00+00:00'));
                items.push(buildObjectItem('/SAP Employee Central', 'EVENT_REASONS.csv', 'utf-8', 7775, '2018-01-02T23:33:00+00:00'));
                items.push(buildObjectItem('/SAP Employee Central', 'FREQUENCY.csv', 'utf-8', 1704, '2018-01-02T23:33:00+00:00'));
                items.push(buildObjectItem('/SAP Employee Central', 'GENERIC_OBJECTS.csv', 'utf-8', 1662477, '2018-01-02T23:33:00+00:00'));
                items.push(buildObjectItem('/SAP Employee Central', 'GENERIC_RELATIONSHIPS.csv', 'utf-8', 98782, '2018-01-02T23:33:00+00:00'));
                items.push(buildObjectItem('/SAP Employee Central', 'JOB_CLASS.csv', 'utf-8', 338260, '2018-01-02T23:33:00+00:00'));
                items.push(buildObjectItem('/SAP Employee Central', 'JOB_INFO.csv', 'utf-8', 1546379, '2018-01-02T23:33:00+00:00'));
                items.push(buildObjectItem('/SAP Employee Central', 'LABELS.csv', 'utf-8', 126838, '2018-01-02T23:33:00+00:00'));
                items.push(buildObjectItem('/SAP Employee Central', 'LOCATIONS.csv', 'utf-8', 2995, '2018-01-02T23:33:00+00:00'));
                items.push(buildObjectItem('/SAP Employee Central', 'PAY_COMPONENT.csv', 'utf-8', 1234, '2018-01-02T23:33:00+00:00'));
                items.push(buildObjectItem('/SAP Employee Central', 'PERSON_INFO_GLOBAL.csv', 'utf-8', 82438, '2018-01-02T23:33:00+00:00'));
                items.push(buildObjectItem('/SAP Employee Central', 'PERSON.csv', 'utf-8', 44896, '2018-01-02T23:33:00+00:00'));
                items.push(buildObjectItem('/SAP Employee Central', 'PERSONAL_DATA.csv', 'utf-8', 105949, '2018-01-02T23:33:00+00:00'));
                items.push(buildObjectItem('/SAP Employee Central', 'PICKLISTS.csv', 'utf-8', 78044, '2018-01-02T23:33:00+00:00'));
                items.push(buildObjectItem('/SAP Employee Central', 'TERRITORY.csv', 'utf-8', 8541, '2018-01-02T23:33:00+00:00'));
            } else if (directoryPath.startsWith('/Test Files')) {
                items.push(buildFolderItem('/Encoding', 30));
            } else if (directoryPath.startsWith('/Encoding')) {
                items.push(buildObjectItem('/Test Files/Encoding', 'big5', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'euc_jp', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'euc_kr', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'gb18030', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'iso2022jp', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'iso88592_cs', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'iso88595_ru', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'iso88596_ar', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'iso88597_el', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'koi8r', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'lang_arabic', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'lang_chinese', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'lang_czech', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'lang_greek', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'lang_hebrew', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'lang_japanese', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'lang_korean', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'lang_russian', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'lang_turkish', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'shiftjis', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'utf16be', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'utf16le', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'utf8', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'windows_1250', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'windows_1251', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'windows_1252', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'windows_1253', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'windows_1254', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'windows_1255', undefined, undefined, undefined));
                items.push(buildObjectItem('/Test Files/Encoding', 'windows_1256', undefined, undefined, undefined));
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
 * Build a folder item.
 * @param directoryPath
 * @param childItemCount
 * @returns
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
        kind: undefined,
        label: lastDirectoryName,
        lastModifiedAt: undefined,
        name: lastDirectoryName,
        referenceId: undefined,
        size: undefined,
        typeId: SourceItemTypeId.Folder
    };
};

/**
 * Build an object item.
 * @param directoryPath
 * @param name
 * @param encodingId
 * @param size
 * @param lastModifiedAtString
 * @returns
 */
const buildObjectItem = (directoryPath: string, name: string, encodingId: string, size: number, lastModifiedAtString: string): SourceItem => ({
    _id: undefined,
    childItemCount: undefined,
    directoryPath,
    encodingId,
    extension: 'csv',
    id: name,
    insertedId: undefined,
    kind: 'text/csv',
    label: name,
    lastModifiedAt: Date.parse(lastModifiedAtString),
    name,
    referenceId: undefined,
    size,
    typeId: SourceItemTypeId.Object
});
