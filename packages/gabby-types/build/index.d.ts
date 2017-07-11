export interface IRouteNode {
    name?: string;
    to?: string;
    when?: string;
    handler?: Function;
    children: IRouteNode[];
}
export declare type IRoutes = IRouteNode;
export interface IIntent {
    name: string;
    phrases: string[];
    description?: string;
}
export declare type IIntents = IIntent[];
export interface IEntityValue {
    name: string;
    synonyms: string[];
}
export interface IEntity {
    name: string;
    values: IEntityValue[];
    fuzzy?: boolean;
    description?: string;
}
export declare type IEntities = IEntity[];
export interface ILogger {
    log: Function;
    info: Function;
    warn: Function;
    error: Function;
}
export declare type IHandlers = Map<string, Function>;
export declare type status = 'TRAINING' | 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN';
export interface IAdapter {
    getWorkspaceStatus(): Promise<status>;
    applyChanges({routes, intents, entities}: {
        routes: any;
        intents: any;
        entities: any;
    }): Promise<{}>;
    sendMessage(msg: string, to?: string, context?: object): Promise<{
        conversationId: string;
        context: object;
        intents: object[];
        entities: object[];
        templateId: string;
    }>;
}
