import { IAdapter, IRoutes, IIntents, IEntities, ILogger } from 'gabby-types';
export interface IGabby {
    adapter: IAdapter;
    routes?: IRoutes;
    intents?: IIntents;
    entities?: IEntities;
    logger?: ILogger;
}
export declare class Gabby {
    private dirty;
    private handlers;
    private _adapter;
    private _routes;
    private _intents;
    private _entities;
    private _logger;
    private contexts;
    constructor({adapter, routes, intents, entities, logger}: IGabby);
    applyChanges(): Promise<void>;
    sendMessage(message: string, to?: string): Promise<{
        msg: string;
        conversationId: string;
    }>;
    routes: IRoutes;
    intents: IIntents;
    entities: IEntities;
    adapter: IAdapter;
    logger: ILogger;
}
export default Gabby;
