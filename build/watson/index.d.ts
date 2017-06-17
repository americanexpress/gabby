import { ConversationV1 } from 'watson-developer-cloud';
import { IWatsonProps, IRoutes, IIntents, IEntities } from '../interfaces';
export declare class Gab extends ConversationV1 {
    private workspaceName;
    private credentials;
    private routes;
    private intents;
    private entities;
    private handlers;
    private logger;
    private contexts;
    constructor({name, credentials, routes, intents, entities, logger}: IWatsonProps);
    applyChanges(): Promise<{}>;
    sendMessage(msg: string, to?: string): Promise<{}>;
    getWorkspaceName(): string;
    getRoutes(): IRoutes;
    setRoutes(routes: IRoutes): this;
    getIntents(): IIntents;
    setIntents(intents: IIntents): this;
    getEntities(): IEntities;
    setEntities(entities: IEntities): this;
}
export default Gab;
