export enum ConnectionClassId {
    FileStorage = 'fileStorage'
}

export enum ItemTypeId {
    Folder = 'folder',
    Object = 'object'
}

export interface AppEnvironment {
    placeholder: unknown;
}

export interface AppSession {
    placeholder: unknown;
}

export interface Connection {
    isAborted: boolean;
}

export interface Connector {
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

export interface ConnectorPlugin {
    default: {
        new (appEnvironment: AppEnvironment | undefined, appSession: AppSession | undefined, connection: Connection | undefined): Connector;
    };
}

export interface ConnectorCreateInterface {
    placeholder: unknown;
}

// export interface ConnectorPreviewInterface {
//     connector: Connector;
//     previewItem(
//         connector: Connector,
//         accountId: string | undefined,
//         sessionAccessToken: string | undefined,
//         sourceViewProperties: SourceViewProperties,
//         previewInterfaceSettings: ConnectorPreviewInterfaceSettings
//     ): Promise<ConnectorPreviewInterfaceResult>;
// }
export interface SourceViewProperties {
    path: string;
}
export enum ConnectorInterfaceResultType {
    ArrayBuffer = 'arrayBuffer',
    JSON = 'json'
}
export interface ConnectorPreviewInterface {
    connector: Connector;
    previewItem(
        connector: Connector,
        accountId: string | undefined,
        sessionAccessToken: string | undefined,
        sourceViewProperties: SourceViewProperties
        // previewInterfaceSettings: ConnectorPreviewInterfaceSettings
    ): Promise<unknown>;
}

export interface ConnectorReadInterface {
    placeholder: unknown;
}

export interface ConnectorWriteInterface {
    placeholder: unknown;
}

export interface SourceItemPage {
    cursor: string | undefined;
    isMore: boolean;
    items: SourceItem[];
}

export interface SourceItem {
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

export const extractLastSubDirectoryFromPath = (directory: string): string | undefined => {
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
