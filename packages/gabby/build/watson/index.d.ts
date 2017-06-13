import { ConversationV1 } from 'watson-developer-cloud';
import { IWatsonProps, IRoutes } from '../interfaces';
export declare class Watson extends ConversationV1 {
    private credentials;
    private routes;
    private intents;
    private entities;
    private handlers;
    private contexts;
    constructor({credentials, routes, intents, entities}: IWatsonProps);
    init(): Promise<{}>;
    sendMessage(msg: string, to?: string): Promise<{}>;
    setRoutes(routes: IRoutes): void;
}
export default Watson;
