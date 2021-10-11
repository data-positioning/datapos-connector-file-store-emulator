/**
 * @author Jonathan Terrell <jonathan.terrell@springbrook.es>
 * @copyright Copyright (c) 2019-2021 Springbrook S.L.
 * @license "ISC"
 */

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Declarations - Constants and Variables
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const connectorName = 'connectorPlugin.SampleDataConnector';

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Declarations - Classes
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

class SampleDataConnector implements Connector {
    appEnvironment: AppEnvironment;
    appSession: AppSession;
    connectionItem: ConnectionItem;
    classId: string;

    /**
     * ?
     * @param appEnvironment ?
     * @param appSession ?
     * @param connectionItem ?
     */
    constructor(appEnvironment: AppEnvironment, appSession: AppSession, connectionItem: ConnectionItem) {
        this.appEnvironment = appEnvironment;
        this.appSession = appSession;
        this.connectionItem = connectionItem;
        this.classId = this.appEnvironment.commonHelpers.connectionClassId.fileServiceConnection;
    }

    abort(): void {
        this.connectionItem.isAborted = true;
    }

    async authenticate(accountId: string, sessionAccessToken: string, screenHeight: number, screenWidth: number): Promise<void> {
        return Promise.reject(new Error('Not implemented'));
    }

    createInterfaceGet(): ConnectorCreateInterface {
        throw new Error('Not implemented');
    }

    async describe(accountId: string, sessionAccessToken: string, itemId: string): Promise<ResultSetRow[]> {
        return Promise.reject(new Error('Not implemented'));
    }

    async folderItemCountsGet(accountId: string, sessionAccessToken: string, directory: string): Promise<ConnectorFolderItemCounts> {
        return Promise.reject(new Error('Not implemented'));
    }

    async itemList(accountId: string, sessionAccessToken: string, directory: string): Promise<ConnectorItems> {
        return itemList(this, directory);
    }

    previewInterfaceGet(): ConnectorPreviewInterface {
        throw new Error('Not implemented');
    }

    readInterfaceGet(): ConnectorReadInterface {
        throw new Error('Not implemented');
    }

    writeInterfaceGet(): ConnectorWriteInterface {
        throw new Error('Not implemented');
    }
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export default SampleDataConnector;

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Procedure - Item - List
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const itemList = (thisConnector: Connector, directory: string): ConnectorItems => {
    try {
        const items = [];
        if (directory.startsWith('/SAP Employee Central')) {
            items.push(objectItemBuilder(thisConnector, '/SAP Employee Central', 'ADDRESS_INFO.csv', 'utf-8', 208015, '2018-01-02T23:33:00+00:00'));
            items.push(objectItemBuilder(thisConnector, '/SAP Employee Central', 'COMP_CUR_CONV.csv', 'utf-8', 2245, '2018-01-02T23:33:00+00:00'));
            items.push(objectItemBuilder(thisConnector, '/SAP Employee Central', 'EMP_COMP_INFO.csv', 'utf-8', 1665179, '2018-01-02T23:33:00+00:00'));
            items.push(objectItemBuilder(thisConnector, '/SAP Employee Central', 'EMP_PAYCOMP_RECURRING.csv', 'utf-8', 1551764, '2018-01-02T23:33:00+00:00'));
            items.push(objectItemBuilder(thisConnector, '/SAP Employee Central', 'EMPLOYMENT_INFO.csv', 'utf-8', 128575, '2018-01-02T23:33:00+00:00'));
            items.push(objectItemBuilder(thisConnector, '/SAP Employee Central', 'EVENT_REASONS.csv', 'utf-8', 7775, '2018-01-02T23:33:00+00:00'));
            items.push(objectItemBuilder(thisConnector, '/SAP Employee Central', 'FREQUENCY.csv', 'utf-8', 1704, '2018-01-02T23:33:00+00:00'));
            items.push(objectItemBuilder(thisConnector, '/SAP Employee Central', 'GENERIC_OBJECTS.csv', 'utf-8', 1662477, '2018-01-02T23:33:00+00:00'));
            items.push(objectItemBuilder(thisConnector, '/SAP Employee Central', 'GENERIC_RELATIONSHIPS.csv', 'utf-8', 98782, '2018-01-02T23:33:00+00:00'));
            items.push(objectItemBuilder(thisConnector, '/SAP Employee Central', 'JOB_CLASS.csv', 'utf-8', 338260, '2018-01-02T23:33:00+00:00'));
            items.push(objectItemBuilder(thisConnector, '/SAP Employee Central', 'JOB_INFO.csv', 'utf-8', 1546379, '2018-01-02T23:33:00+00:00'));
            items.push(objectItemBuilder(thisConnector, '/SAP Employee Central', 'LABELS.csv', 'utf-8', 126838, '2018-01-02T23:33:00+00:00'));
            items.push(objectItemBuilder(thisConnector, '/SAP Employee Central', 'LOCATIONS.csv', 'utf-8', 2995, '2018-01-02T23:33:00+00:00'));
            items.push(objectItemBuilder(thisConnector, '/SAP Employee Central', 'PAY_COMPONENT.csv', 'utf-8', 1234, '2018-01-02T23:33:00+00:00'));
            items.push(objectItemBuilder(thisConnector, '/SAP Employee Central', 'PERSON_INFO_GLOBAL.csv', 'utf-8', 82438, '2018-01-02T23:33:00+00:00'));
            items.push(objectItemBuilder(thisConnector, '/SAP Employee Central', 'PERSON.csv', 'utf-8', 44896, '2018-01-02T23:33:00+00:00'));
            items.push(objectItemBuilder(thisConnector, '/SAP Employee Central', 'PERSONAL_DATA.csv', 'utf-8', 105949, '2018-01-02T23:33:00+00:00'));
            items.push(objectItemBuilder(thisConnector, '/SAP Employee Central', 'PICKLISTS.csv', 'utf-8', 78044, '2018-01-02T23:33:00+00:00'));
            items.push(objectItemBuilder(thisConnector, '/SAP Employee Central', 'TERRITORY.csv', 'utf-8', 8541, '2018-01-02T23:33:00+00:00'));
        } else {
            items.push(folderItemBuilder(thisConnector, '/SAP Employee Central', 19));
        }
        return { cursor: null, isMore: false, items };
    } catch (error) {
        throw thisConnector.appEnvironment.commonHelpers.error.addContext(error, connectorName, 'itemList');
    }
};

const folderItemBuilder = (thisConnector: Connector, directory: string, itemCount: number): IndexEntry => {
    const lastSubDirectoryName = thisConnector.appEnvironment.commonHelpers.path.extractLastSubDirectory(directory);
    return {
        _id: null,
        childCount: itemCount,
        directory,
        encodingId: undefined,
        extension: undefined,
        id: null,
        insertedId: null,
        kind: undefined,
        label: lastSubDirectoryName,
        lastModifiedAt: undefined,
        name: lastSubDirectoryName,
        referenceId: null,
        size: undefined,
        typeId: thisConnector.appEnvironment.commonHelpers.itemTypeId.folder
    };
};

const objectItemBuilder = (thisConnector: Connector, directory: string, name: string, encodingId: string, size: number, lastModifiedAtString: string): IndexEntry => ({
    _id: null,
    childCount: undefined,
    directory,
    encodingId,
    extension: 'csv',
    id: name,
    insertedId: null,
    kind: 'text/csv',
    label: name,
    lastModifiedAt: thisConnector.appEnvironment.moment(lastModifiedAtString).valueOf(),
    name,
    referenceId: null,
    size,
    typeId: thisConnector.appEnvironment.commonHelpers.itemTypeId.object
});
