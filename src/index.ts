/**
 * @author Jonathan Terrell <jonathan.terrell@springbrook.es>
 * @copyright Copyright (c) 2019-2021 Springbrook S.L.
 * @license "Apache-2.0 with Commons Clause"
 */

import {
    AppEnvironment,
    AppSession,
    ConnectionItem,
    Connector,
    ConnectorCreateInterface,
    ConnectorFolderItemCounts,
    ConnectorItems,
    ConnectorPreviewInterface,
    ConnectorPreviewInterfaceSettings,
    ConnectorReadInterface,
    ConnectorReadInterfaceSettings,
    ConnectorWriteInterface,
    IndexEntry,
    ResultSetRow,
    SourceViewProperties
} from '@nectis/nectis-common-types';
import { ParseError, ParseResult } from 'papaparse';

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Declarations - Constants and Variables
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const connectorName = 'connectorPlugin.SampleDataConnector';
const sourceURLPrefix = 'https://nectis-sample-data.web.app/fileShare';

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

    /**
     * ?
     */
    abort(): void {
        try {
            this.connectionItem.isAborted = true;
        } catch (error) {
            throw this.appEnvironment.commonHelpers.error.addContext(error, connectorName, 'abort.1');
        }
    }

    /**
     * ?
     * @param accountId ?
     * @param sessionAccessToken ?
     * @param screenHeight ?
     * @param screenWidth ?
     * @returns ?
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async authenticate(accountId: string, sessionAccessToken: string, screenHeight: number, screenWidth: number): Promise<void> {
        return Promise.reject(this.appEnvironment.commonHelpers.error.addContext(new Error('Not implemented'), connectorName, 'authenticate.1'));
    }

    /**
     * ?
     */
    createInterfaceGet(): ConnectorCreateInterface {
        throw this.appEnvironment.commonHelpers.error.addContext(new Error('Not implemented'), connectorName, 'createInterfaceGet.1');
    }

    /**
     * ?
     * @param accountId ?
     * @param sessionAccessToken ?
     * @param itemId ?
     * @returns ?
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async describe(accountId: string, sessionAccessToken: string, itemId: string): Promise<ResultSetRow[]> {
        return Promise.reject(this.appEnvironment.commonHelpers.error.addContext(new Error('Not implemented'), connectorName, 'describe.1'));
    }

    /**
     * ?
     * @param accountId ?
     * @param sessionAccessToken ?
     * @param directory ?
     * @returns ?
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async folderItemCountsGet(accountId: string, sessionAccessToken: string, directory: string): Promise<ConnectorFolderItemCounts> {
        return Promise.reject(this.appEnvironment.commonHelpers.error.addContext(new Error('Not implemented'), connectorName, 'folderItemCountsGet.1'));
    }

    /**
     * ?
     * @param accountId ?
     * @param sessionAccessToken ?
     * @param directory ?
     * @returns ?
     */
    // eslint-disable-next-line @typescript-eslint/require-await
    async itemList(accountId: string, sessionAccessToken: string, directory: string): Promise<ConnectorItems> {
        try {
            return itemList(this, directory);
        } catch (error) {
            throw this.appEnvironment.commonHelpers.error.addContext(error, connectorName, 'retrieveItems.1');
        }
    }

    /**
     * ?
     * @returns ?
     */
    previewInterfaceGet(): ConnectorPreviewInterface {
        try {
            return { connector: this, itemPreview };
        } catch (error) {
            throw this.appEnvironment.commonHelpers.error.addContext(error, connectorName, 'getPreviewInterface.1');
        }
    }

    /**
     * ?
     * @returns ?
     */
    readInterfaceGet(): ConnectorReadInterface {
        try {
            return { connector: this, itemRead };
        } catch (error) {
            throw this.appEnvironment.commonHelpers.error.addContext(error, connectorName, 'getReadInterface.1');
        }
    }

    /**
     * ?
     */
    writeInterfaceGet(): ConnectorWriteInterface {
        throw this.appEnvironment.commonHelpers.error.addContext(new Error('Not implemented'), connectorName, 'writeInterfaceGet.1');
    }
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export default SampleDataConnector;

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Procedure - Item - List
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * ?
 * @param thisConnector ?
 * @param directory ?
 * @returns ?
 */
// eslint-disable-next-line max-lines-per-function
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

/**
 * ?
 * @param thisConnector ?
 * @param directory ?
 * @param itemCount ?
 * @returns ?
 */
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

/**
 * ?
 * @param thisConnector ?
 * @param directory ?
 * @param name ?
 * @param encodingId ?
 * @param size ?
 * @param lastModifiedAtString ?
 * @returns ?
 */
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

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Procedure - Item - Preview
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * ?
 * @param thisConnector ?
 * @param accountId ?
 * @param sessionAccessToken ?
 * @param sourceViewProperties ?
 * @param previewInterfaceSettings ?
 * @returns ?
 */
const itemPreview = async (
    thisConnector: Connector,
    accountId: string,
    sessionAccessToken: string,
    sourceViewProperties: SourceViewProperties,
    previewInterfaceSettings: ConnectorPreviewInterfaceSettings
): Promise<void> => {
    try {
        const response = await thisConnector.appEnvironment.axios({
            headers: {
                Range: `bytes=0-${previewInterfaceSettings.chunkSize}`
            },
            method: 'get',
            responseType: 'arraybuffer',
            url: `${sourceURLPrefix}${sourceViewProperties.path}`
        });
        previewInterfaceSettings.complete({ data: response.data, typeId: 'arrayBuffer' });
    } catch (error) {
        previewInterfaceSettings.error(thisConnector.appEnvironment.commonHelpers.error.addContext(error, connectorName, 'itemPreview.1'));
    }
};

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Procedure - Item - Read
// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * ?
 * @param thisConnector ?
 * @param accountId ?
 * @param sessionAccessToken ?
 * @param sourceViewProperties ?
 * @param readInterfaceSettings ?
 * @returns ?
 */
const itemRead = async (
    thisConnector: Connector,
    accountId: string,
    sessionAccessToken: string,
    sourceViewProperties: SourceViewProperties,
    readInterfaceSettings: ConnectorReadInterfaceSettings
    // eslint-disable-next-line @typescript-eslint/require-await
): Promise<void> => {
    try {
        thisConnector.appEnvironment.papaParse.parse(`${sourceURLPrefix}${sourceViewProperties.path}`, {
            beforeFirstChunk: undefined,
            chunk: (result: ParseResult<ResultSetRow>) => {
                readInterfaceSettings.chunk(result.data);
            },
            chunkSize: readInterfaceSettings.chunkSize || null,
            comments: false,
            complete: () => {
                readInterfaceSettings.complete();
            },
            delimiter: sourceViewProperties.preview.fieldDelimiterId,
            download: true,
            downloadRequestHeaders: {},
            dynamicTyping: false,
            encoding: sourceViewProperties.preview.encodingId,
            error: (error: ParseError) => {
                readInterfaceSettings.error(error);
            },
            fastMode: undefined,
            header: false,
            newline: '',
            preview: 0,
            quoteChar: '"',
            skipEmptyLines: false,
            withCredentials: undefined,
            worker: false
        });
    } catch (error) {
        readInterfaceSettings.error(thisConnector.appEnvironment.commonHelpers.error.addContext(error, connectorName, 'itemRead.1'));
    }
};
