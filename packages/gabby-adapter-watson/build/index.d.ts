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
