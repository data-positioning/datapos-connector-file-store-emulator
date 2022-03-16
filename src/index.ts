/**
 * @author Jonathan Terrell <jonathan.terrell@springbrook.es>
 * @copyright Copyright (c) 2022 Springbrook S.L.
 * @file src/index.ts
 * @license "ISC"
 */

// Engine component dependencies.
import { Connection } from '../../../../nectis-engine-components/src/connection';
import {
    DataConnector,
    ConnectorCreateInterface,
    ConnectorPreviewInterface,
    ConnectorPreviewInterfaceSettings,
    ConnectorReadInterface,
    ConnectorWriteInterface
} from '../../../../nectis-engine-components/src/connector/data';
import { SourceItem, SourceItemPage, SourceItemPreview, SourceItemPreviewTypeId, SourceItemTypeId } from '../../../../nectis-engine-components/src/sourceItem';
import { SourceViewProperties } from '../../../../nectis-engine-components/src/sourceView';

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Declarations
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const defaultChunkSize = 4096;
const urlPrefix = 'https://firebasestorage.googleapis.com/v0/b/nectis-app-v00-dev-alpha.appspot.com/o/fileStore';

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Connector
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export default class SampleFileDataConnector implements DataConnector {
    connection: Connection;
    id: string;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    abort(): void {
        this.connection.isAborted = true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async authenticate(accountId: string, sessionAccessToken: string, screenHeight: number, screenWidth: number): Promise<void> {
        return Promise.reject(new Error('Not implemented'));
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async describe(accountId: string, sessionAccessToken: string, itemId: string): Promise<unknown[]> {
        return Promise.reject(new Error('Not implemented'));
    }

    getCreateInterface(): ConnectorCreateInterface {
        throw new Error('Not implemented');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getFolderItemCounts(accountId: string, sessionAccessToken: string, directory: string): Promise<unknown> {
        return Promise.reject(new Error('Not implemented'));
    }

    getPreviewInterface(): ConnectorPreviewInterface {
        return { connector: this, previewItem };
    }

    getReadInterface(): ConnectorReadInterface {
        throw new Error('Not implemented');
    }

    getWriteInterface(): ConnectorWriteInterface {
        throw new Error('Not implemented');
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async retrieveItems(accountId: string, sessionAccessToken: string, directory: string): Promise<SourceItemPage> {
        return retrieveItems(directory);
    }
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Preview Item
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const previewItem = async (
    thisConnector: DataConnector,
    accountId: string | undefined,
    sessionAccessToken: string | undefined,
    previewInterfaceSettings: ConnectorPreviewInterfaceSettings,
    sourceViewProperties: SourceViewProperties
): Promise<SourceItemPreview> => {
    const headers: HeadersInit = {
        Range: `bytes=0-${previewInterfaceSettings.chunkSize || defaultChunkSize}`
    };
    const response = await fetch(`${urlPrefix}${encodeURIComponent(sourceViewProperties.path)}?alt=media`, { headers });
    if (!response.ok) throw new Error(response.statusText);
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    return { data: uint8Array, typeId: SourceItemPreviewTypeId.Uint8Array };
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Retrieve Items
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const retrieveItems = (directory: string): SourceItemPage => {
    const items: SourceItem[] = [];
    if (directory.startsWith('/SAP Employee Central')) {
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
    } else if (directory.startsWith('/Test Files')) {
        items.push(buildFolderItem('/Encoding', 30));
    } else if (directory.startsWith('/Encoding')) {
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
    return { cursor: undefined, isMore: false, items };
};

const buildFolderItem = (directory: string, itemCount: number): SourceItem => {
    const lastSubDirectoryName = extractLastSubDirectoryFromPath(directory);
    return {
        _id: undefined,
        childCount: itemCount,
        directory,
        encodingId: undefined,
        extension: undefined,
        id: undefined,
        insertedId: undefined,
        kind: undefined,
        label: lastSubDirectoryName,
        lastModifiedAt: undefined,
        name: lastSubDirectoryName,
        referenceId: undefined,
        size: undefined,
        typeId: SourceItemTypeId.Folder
    };
};

const buildObjectItem = (directory: string, name: string, encodingId: string, size: number, lastModifiedAtString: string): SourceItem => ({
    _id: undefined,
    childCount: undefined,
    directory,
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

const extractLastSubDirectoryFromPath = (directory: string): string | undefined => {
    if (directory) {
        let lastSeparatorIndex;
        let lastCharacterIndex;
        if (directory.endsWith('/')) {
            lastSeparatorIndex = directory.lastIndexOf('/', directory.length - 2);
            lastCharacterIndex = directory.length - 1;
        } else {
            lastSeparatorIndex = directory.lastIndexOf('/');
            lastCharacterIndex = directory.length;
        }
        if (lastSeparatorIndex > -1) return directory.substring(lastSeparatorIndex + 1, lastCharacterIndex);
    }
    return undefined;
};
