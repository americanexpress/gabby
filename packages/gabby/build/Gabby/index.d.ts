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
 
import { ConversationV1 } from 'watson-developer-cloud';
import { IWatsonProps, IRoutes, IIntents, IEntities } from '../interfaces';
export declare class Gabby extends ConversationV1 {
    private workspaceName;
    private credentials;
    private routes;
    private intents;
    private entities;
    private handlers;
    private logger;
    private maxStatusPollCount;
    private statusPollRate;
    private contexts;
    constructor({name, credentials, routes, intents, entities, logger, maxStatusPollCount, statusPollRate}: IWatsonProps);
    getWorkspaceStatus(): Promise<{}>;
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
export default Gabby;
