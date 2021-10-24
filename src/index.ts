/**
 * @author Jonathan Terrell <jonathan.terrell@springbrook.es>
 * @copyright Copyright (c) 2019-2021 Springbrook S.L.
 * @license "ISC"
 */

import {
    AppEnvironment,
    AppSession,
    Connection,
    ConnectionClassId,
    Connector,
    ConnectorCreateInterface,
    ConnectorInterfaceResultType,
    ConnectorPreviewInterface,
    ConnectorReadInterface,
    ConnectorWriteInterface,
    ItemTypeId,
    SourceItem,
    SourceItemPage,
    SourceViewProperties,
    extractLastSubDirectoryFromPath
} from '../../nectis-connector-interface';

const sourceURLPrefix = 'https://nectis-sample-data.web.app/fileShare';

// -----------------------------------------------------------------------------------------------------------------------------------------
// Connector
// -----------------------------------------------------------------------------------------------------------------------------------------

export class SampleFileConnector implements Connector {
    appEnvironment: AppEnvironment;
    appSession: AppSession;
    connection: Connection;
    connectionClassId: ConnectionClassId;

    /**
     * ?
     * @param appEnvironment ?
     * @param appSession ?
     * @param connection ?
     */
    constructor(appEnvironment: AppEnvironment, appSession: AppSession, connection: Connection) {
        this.appEnvironment = appEnvironment;
        this.appSession = appSession;
        this.connection = connection;
        this.connectionClassId = ConnectionClassId.FileStorage;
    }

    abort(): void {
        this.connection.isAborted = true;
    }

    async authenticate(accountId: string, sessionAccessToken: string, screenHeight: number, screenWidth: number): Promise<void> {
        return Promise.reject(new Error('Not implemented'));
    }

    async describe(accountId: string, sessionAccessToken: string, itemId: string): Promise<unknown[]> {
        return Promise.reject(new Error('Not implemented'));
    }

    getCreateInterface(): ConnectorCreateInterface {
        throw new Error('Not implemented');
    }

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

// -----------------------------------------------------------------------------------------------------------------------------------------
// Preview Item
// -----------------------------------------------------------------------------------------------------------------------------------------

const previewItem = async (
    thisConnector: Connector,
    accountId: string | undefined,
    sessionAccessToken: string | undefined,
    sourceViewProperties: SourceViewProperties
    // previewInterfaceSettings: ConnectorPreviewInterfaceSettings
): Promise<unknown> => {
    try {
        if (!sourceViewProperties.path) throw new Error('Missing path');

        const headers: HeadersInit = {};
        // if (previewInterfaceSettings.chunkSize) headers.Range = `bytes=0-${previewInterfaceSettings.chunkSize}`;
        headers.Range = 'bytes=0-10';

        const response = await fetch(`${sourceURLPrefix}${sourceViewProperties.path}`, { headers });
        const blob = await response.text();

        return { data: blob, typeId: ConnectorInterfaceResultType.ArrayBuffer };
    } catch (error) {
        console.log(9999, error);
    }
};

// -----------------------------------------------------------------------------------------------------------------------------------------
// Retrieve Items
// -----------------------------------------------------------------------------------------------------------------------------------------

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
    } else {
        items.push(buildFolderItem('/SAP Employee Central', 19));
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
        typeId: ItemTypeId.Folder
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
    typeId: ItemTypeId.Object
});
