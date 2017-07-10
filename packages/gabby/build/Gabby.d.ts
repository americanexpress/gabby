import { IRoutes, IIntents, IEntities } from './interfaces';
export declare class Gabby {
    private adapter;
    private routes;
    private intents;
    private entities;
    private handlers;
    private logger;
    private maxStatusPollCount;
    private statusPollRate;
    private contexts;
    constructor({adapter, routes, intents, entities, logger, maxStatusPollCount, statusPollRate}: {
        adapter: any;
        routes: any;
        intents?: undefined[];
        entities?: undefined[];
        logger: any;
        maxStatusPollCount?: number;
        statusPollRate?: number;
    });
    sendMessage(msg: string, to?: string): Promise<{}>;
    applyChanges(): Promise<{}>;
    getRoutes(): IRoutes;
    setRoutes(routes: IRoutes): this;
    getIntents(): IIntents;
    setIntents(intents: IIntents): this;
    getEntities(): IEntities;
    setEntities(entities: IEntities): this;
}
export default Gabby;
