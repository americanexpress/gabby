import { IAdapter, ILogger, status } from 'gabby-types';
export interface IWatsonCredentials {
    username: string;
    password: string;
    workspaceId: string;
}
export interface IWatson extends IWatsonCredentials {
    name: string;
    statusPollRate?: number;
    maxStatusPollCount?: number;
    logger?: ILogger;
}
export default class Watson implements IAdapter {
    private client;
    private workspaceName;
    private credentials;
    private logger;
    private statusPollRate;
    private maxStatusPollCount;
    constructor({name, username, password, workspaceId, statusPollRate, maxStatusPollCount, logger}: IWatson);
    applyChanges({routes, intents, entities}: {
        routes: any;
        intents: any;
        entities: any;
    }): Promise<{}>;
    getWorkspaceStatus(): Promise<status>;
    sendMessage(msg: string, to?: string, context?: {}): Promise<{
        conversationId: string;
        templateId: string;
        intents: object[];
        entities: object[];
        context: object;
    }>;
}
