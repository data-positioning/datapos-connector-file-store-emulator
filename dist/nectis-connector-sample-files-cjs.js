'use strict';

var ConnectionClassId;
(function (ConnectionClassId) {
    ConnectionClassId["FileStorage"] = "fileStorage";
})(ConnectionClassId || (ConnectionClassId = {}));
var ItemTypeId;
(function (ItemTypeId) {
    ItemTypeId["Folder"] = "folder";
    ItemTypeId["Object"] = "object";
})(ItemTypeId || (ItemTypeId = {}));
var ConnectorInterfaceResultType;
(function (ConnectorInterfaceResultType) {
    ConnectorInterfaceResultType["ArrayBuffer"] = "arrayBuffer";
    ConnectorInterfaceResultType["JSON"] = "json";
})(ConnectorInterfaceResultType || (ConnectorInterfaceResultType = {}));
const extractLastSubDirectoryFromPath = (directory) => {
    if (directory) {
        let lastSeparatorIndex;
        let lastCharacterIndex;
        if (directory.endsWith('/')) {
            lastSeparatorIndex = directory.lastIndexOf('/', directory.length - 2);
            lastCharacterIndex = directory.length - 1;
        }
        else {
            lastSeparatorIndex = directory.lastIndexOf('/');
            lastCharacterIndex = directory.length;
        }
        if (lastSeparatorIndex > -1)
            return directory.substring(lastSeparatorIndex + 1, lastCharacterIndex);
    }
    return undefined;
};

/**
 * @author Jonathan Terrell <jonathan.terrell@springbrook.es>
 * @copyright Copyright (c) 2019-2021 Springbrook S.L.
 * @license "ISC"
 */
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Declarations - Variables
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const sourceURLPrefix = 'https://nectis-sample-data.web.app/fileShare';
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Declarations - Classes
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
class SampleFileConnector {
    appEnvironment;
    appSession;
    connection;
    connectionClassId;
    /**
     * ?
     * @param appEnvironment ?
     * @param appSession ?
     * @param connection ?
     */
    constructor(appEnvironment, appSession, connection) {
        this.appEnvironment = appEnvironment;
        this.appSession = appSession;
        this.connection = connection;
        this.connectionClassId = ConnectionClassId.FileStorage;
    }
    abort() {
        this.connection.isAborted = true;
    }
    async authenticate(accountId, sessionAccessToken, screenHeight, screenWidth) {
        return Promise.reject(new Error('Not implemented'));
    }
    async describe(accountId, sessionAccessToken, itemId) {
        return Promise.reject(new Error('Not implemented'));
    }
    getCreateInterface() {
        throw new Error('Not implemented');
    }
    async getFolderItemCounts(accountId, sessionAccessToken, directory) {
        return Promise.reject(new Error('Not implemented'));
    }
    getPreviewInterface() {
        return { connector: this, previewItem };
    }
    getReadInterface() {
        throw new Error('Not implemented');
    }
    getWriteInterface() {
        throw new Error('Not implemented');
    }
    async retrieveItems(accountId, sessionAccessToken, directory) {
        return itemList(directory);
    }
}
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Procedure - Item - List
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const itemList = (directory) => {
    const items = [];
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
    }
    else {
        items.push(folderItemBuilder('/SAP Employee Central', 19));
    }
    return { cursor: undefined, isMore: false, items };
};
const folderItemBuilder = (directory, itemCount) => {
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
const objectItemBuilder = (directory, name, encodingId, size, lastModifiedAtString) => ({
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
const previewItem = async (thisConnector, accountId, sessionAccessToken, sourceViewProperties
// previewInterfaceSettings: ConnectorPreviewInterfaceSettings
) => {
    try {
        console.log(4444, sourceViewProperties);
        // if (!sourceViewProperties.path) throw new Error('Missing path');
        const headers = {};
        // if (previewInterfaceSettings.chunkSize) headers.Range = `bytes=0-${previewInterfaceSettings.chunkSize}`;
        // const response = await thisConnector.appEnvironment.axios<Buffer>({
        //     headers,
        //     method: 'get',
        //     responseType: 'arraybuffer',
        //     url: `${sourceURLPrefix}${sourceViewProperties.path}`
        // });
        const response = await fetch(`${sourceURLPrefix}${sourceViewProperties.path}`);
        // const response = await fetch(`${sourceURLPrefix}/SAP Employee Central/ADDRESS_INFO.csv`);
        console.log(7777, response);
        const blob = await response.text();
        console.log(8888, blob);
        return { data: blob, typeId: ConnectorInterfaceResultType.ArrayBuffer };
    }
    catch (error) {
        console.log(9999, error);
        // throw thisConnector.appEnvironment.commonHelpers.error.addContext(error, connectorName, 'previewItem.2');
    }
};

module.exports = SampleFileConnector;
