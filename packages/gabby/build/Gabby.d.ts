/*
 * Copyright 2017 American Express
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
 
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
