import { ConversationV1 } from 'watson-developer-cloud';
import { IWatsonProps, IRoutes, IIntents, IEntities } from '../interfaces';
export declare class Watson extends ConversationV1 {
    private workspaceName;
    private credentials;
    private routes;
    private intents;
    private entities;
    private handlers;
    private contexts;
    constructor({name, credentials, routes, intents, entities}: IWatsonProps);
    applyChanges(): Promise<{}>;
    sendMessage(msg: string, to?: string): Promise<{}>;
    setRoutes(routes: IRoutes): this;
    setIntents(intents: IIntents): this;
    setEntities(entities: IEntities): this;
}
export default Watson;
