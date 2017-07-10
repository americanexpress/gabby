import IGabbyAdapter, { status } from '../Adapter';
import { ILogger } from '../interfaces';
export interface IWatsonCredentials {
    username: string;
    password: string;
    workspaceId: string;
}
export interface IWatson extends IWatsonCredentials {
    name: string;
    logger: ILogger;
}
export default class Watson implements IGabbyAdapter {
    private client;
    private workspaceName;
    private credentials;
    private logger;
    private statusPollRate;
    private maxStatusPollCount;
    constructor({name, username, password, workspaceId, logger}: IWatson);
    applyChanges({routes: dialog_nodes, intents, entities}: {
        routes: any;
        intents: any;
        entities: any;
    }): Promise<{}>;
    getWorkspaceStatus(): Promise<status>;
    sendMessage(msg: string, to?: string, context?: {}): Promise<{}>;
}
