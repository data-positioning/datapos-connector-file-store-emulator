/**
 * @author Jonathan Terrell <jonathan.terrell@springbrook.es>
 * @copyright Copyright (c) 2019-2021 Springbrook S.L.
 * @license "ISC"
 */
var ConnectionClassId;
(function (ConnectionClassId) {
    ConnectionClassId["FileStorage"] = "fileStorage";
})(ConnectionClassId || (ConnectionClassId = {}));
var SourceItemPreviewTypeId;
(function (SourceItemPreviewTypeId) {
    SourceItemPreviewTypeId["Uint8Array"] = "uint8Array";
    SourceItemPreviewTypeId["JSON"] = "json";
})(SourceItemPreviewTypeId || (SourceItemPreviewTypeId = {}));
var SourceItemTypeId;
(function (SourceItemTypeId) {
    SourceItemTypeId["Folder"] = "folder";
    SourceItemTypeId["Object"] = "object";
})(SourceItemTypeId || (SourceItemTypeId = {}));
// -----------------------------------------------------------------------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------------------------------------------------------------------
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
const defaultChunkSize = 4096;
const urlPrefix = 'https://nectis-sample-data.web.app/fileShare';
// -----------------------------------------------------------------------------------------------------------------------------------------
// Connector
// -----------------------------------------------------------------------------------------------------------------------------------------
class SampleFileConnector {
    connection;
    connectionClassId;
    constructor(connection) {
        this.connection = connection;
        this.connectionClassId = ConnectionClassId.FileStorage;
    }
    abort() {
        this.connection.isAborted = true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async authenticate(accountId, sessionAccessToken, screenHeight, screenWidth) {
        return Promise.reject(new Error('Not implemented'));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async describe(accountId, sessionAccessToken, itemId) {
        return Promise.reject(new Error('Not implemented'));
    }
    getCreateInterface() {
        throw new Error('Not implemented');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // eslint-disable-next-line @typescript-eslint/require-await
    async retrieveItems(accountId, sessionAccessToken, directory) {
        return retrieveItems(directory);
    }
}
// -----------------------------------------------------------------------------------------------------------------------------------------
// Preview Item
// -----------------------------------------------------------------------------------------------------------------------------------------
const previewItem = async (thisConnector, accountId, sessionAccessToken, previewInterfaceSettings, sourceViewProperties) => {
    const headers = {
        Range: `bytes=0-${previewInterfaceSettings.chunkSize || defaultChunkSize}`
    };
    const response = await fetch(`${urlPrefix}${sourceViewProperties.path}`, { headers });
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    return { arrayBuffer, blob, data: uint8Array, typeId: SourceItemPreviewTypeId.Uint8Array };
};
// -----------------------------------------------------------------------------------------------------------------------------------------
// Retrieve Items
// -----------------------------------------------------------------------------------------------------------------------------------------
const retrieveItems = (directory) => {
    console.log('directory', directory);
    const items = [];
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
    }
    else if (directory.startsWith('/Test Files')) {
        items.push(buildFolderItem('/Encoding', 19));
        items.push(buildObjectItem('/Test Files/Encoding', 'koi8_r.txt', 'utf-8', 8541, '2018-01-02T23:33:00+00:00'));
    }
    else if (directory.startsWith('/Encoding')) {
        items.push(buildObjectItem('/Test Files/Encoding', 'koi8_r.txt', 'utf-8', 8541, '2018-01-02T23:33:00+00:00'));
    }
    else {
        items.push(buildFolderItem('/SAP Employee Central', 19));
        items.push(buildFolderItem('/Test Files', 19));
    }
    return { cursor: undefined, isMore: false, items };
};
const buildFolderItem = (directory, itemCount) => {
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
const buildObjectItem = (directory, name, encodingId, size, lastModifiedAtString) => ({
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

export { SampleFileConnector as default };
