/**
 * @author Jonathan Terrell <jonathan.terrell@springbrook.es>
 * @copyright Copyright (c) 2019-2021 Springbrook S.L.
 * @license "ISC"
 */

enum ConnectionClassId {
    FileStorage = 'fileStorage'
}

enum ItemTypeId {
    Folder = 'folder',
    Object = 'object'
}

interface AppEnvironment {}

interface AppSession {}

interface Connection {
    isAborted: boolean;
}

interface Connector {
    appEnvironment: AppEnvironment;
    appSession: AppSession;
    connection: Connection;
    connectionClassId: ConnectionClassId;
    abort(): void;
    authenticate(accountId: string, sessionAccessToken: string, screenHeight: number, screenWidth: number): Promise<void>;
    describe(accountId: string, sessionAccessToken: string, itemId: string): Promise<unknown>;
    getCreateInterface(): ConnectorCreateInterface;
    getFolderItemCounts(accountId: string, sessionAccessToken: string, directory: string): Promise<unknown>;
    getPreviewInterface(): ConnectorPreviewInterface;
    getReadInterface(): ConnectorReadInterface;
    getWriteInterface(): ConnectorWriteInterface;
    retrieveItems(accountId: string | undefined, sessionAccessToken: string | undefined, directory: string): Promise<unknown>;
}

interface ConnectorCreateInterface {}
interface ConnectorPreviewInterface {}
interface ConnectorReadInterface {}
interface ConnectorWriteInterface {}

interface SourceItemPage {
    cursor: string | undefined;
    isMore: boolean;
    items: SourceItem[];
}

interface SourceItem {
    _id: string;
    childCount: number;
    directory: string;
    encodingId: string;
    extension: string;
    id: string;
    insertedId: string;
    kind: string;
    label: string;
    lastModifiedAt: number;
    name: string;
    referenceId: string;
    size: number;
    typeId: ItemTypeId;
}

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

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Declarations - Classes
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

class SampleFileConnector implements Connector {
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
        throw new Error('Not implemented');
    }

    getReadInterface(): ConnectorReadInterface {
        throw new Error('Not implemented');
    }

    getWriteInterface(): ConnectorWriteInterface {
        throw new Error('Not implemented');
    }

    async retrieveItems(accountId: string, sessionAccessToken: string, directory: string): Promise<SourceItemPage> {
        return itemList(directory);
    }
}

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export default SampleFileConnector;

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Procedure - Item - List
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const itemList = (directory: string): SourceItemPage => {
    const items: SourceItem[] = [];
    if (directory.startsWith('/SAP Employee Central')) {
        items.push(objectItemBuilder('/SAP Employee Central', 'ADDRESS_INFO.csv', 'utf-8', 208015, '2018-01-02T23:33:00+00:00'));
        items.push(objectItemBuilder('/SAP Employee Central', 'COMP_CUR_CONV.csv', 'utf-8', 2245, '2018-01-02T23:33:00+00:00'));
        items.push(objectItemBuilder('/SAP Employee Central', 'EMP_COMP_INFO.csv', 'utf-8', 1665179, '2018-01-02T23:33:00+00:00'));
        items.push(objectItemBuilder('/SAP Employee Central', 'EMP_PAYCOMP_RECURRING.csv', 'utf-8', 1551764, '2018-01-02T23:33:00+00:00'));
        items.push(objectItemBuilder('/SAP Employee Central', 'EMPLOYMENT_INFO.csv', 'utf-8', 128575, '2018-01-02T23:33:00+00:00'));
        items.push(objectItemBuilder('/SAP Employee Central', 'EVENT_REASONS.csv', 'utf-8', 7775, '2018-01-02T23:33:00+00:00'));
        items.push(objectItemBuilder('/SAP Employee Central', 'FREQUENCY.csv', 'utf-8', 1704, '2018-01-02T23:33:00+00:00'));
        items.push(objectItemBuilder('/SAP Employee Central', 'GENERIC_OBJECTS.csv', 'utf-8', 1662477, '2018-01-02T23:33:00+00:00'));
        items.push(objectItemBuilder('/SAP Employee Central', 'GENERIC_RELATIONSHIPS.csv', 'utf-8', 98782, '2018-01-02T23:33:00+00:00'));
        items.push(objectItemBuilder('/SAP Employee Central', 'JOB_CLASS.csv', 'utf-8', 338260, '2018-01-02T23:33:00+00:00'));
        items.push(objectItemBuilder('/SAP Employee Central', 'JOB_INFO.csv', 'utf-8', 1546379, '2018-01-02T23:33:00+00:00'));
        items.push(objectItemBuilder('/SAP Employee Central', 'LABELS.csv', 'utf-8', 126838, '2018-01-02T23:33:00+00:00'));
        items.push(objectItemBuilder('/SAP Employee Central', 'LOCATIONS.csv', 'utf-8', 2995, '2018-01-02T23:33:00+00:00'));
        items.push(objectItemBuilder('/SAP Employee Central', 'PAY_COMPONENT.csv', 'utf-8', 1234, '2018-01-02T23:33:00+00:00'));
        items.push(objectItemBuilder('/SAP Employee Central', 'PERSON_INFO_GLOBAL.csv', 'utf-8', 82438, '2018-01-02T23:33:00+00:00'));
        items.push(objectItemBuilder('/SAP Employee Central', 'PERSON.csv', 'utf-8', 44896, '2018-01-02T23:33:00+00:00'));
        items.push(objectItemBuilder('/SAP Employee Central', 'PERSONAL_DATA.csv', 'utf-8', 105949, '2018-01-02T23:33:00+00:00'));
        items.push(objectItemBuilder('/SAP Employee Central', 'PICKLISTS.csv', 'utf-8', 78044, '2018-01-02T23:33:00+00:00'));
        items.push(objectItemBuilder('/SAP Employee Central', 'TERRITORY.csv', 'utf-8', 8541, '2018-01-02T23:33:00+00:00'));
    } else {
        items.push(folderItemBuilder('/SAP Employee Central', 19));
    }
    return { cursor: undefined, isMore: false, items };
};

const folderItemBuilder = (directory: string, itemCount: number): SourceItem => {
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

const objectItemBuilder = (directory: string, name: string, encodingId: string, size: number, lastModifiedAtString: string): SourceItem => ({
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
