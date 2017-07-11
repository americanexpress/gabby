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
 
export interface IRouteNode {
  name?: string;
  to?: string;
  when?: string;
  handler?: Function;
  children: IRouteNode[];
}

export type IRoutes = IRouteNode;

export interface IIntent {
  name: string;
  phrases: string[];
  description?: string;
}

export type IIntents = IIntent[];

export interface IEntityValue {
  name: string;
  synonyms: string[];
}

export interface IEntity {
  name: string;
  values: IEntityValue[];
  fuzzy?: boolean;
  description?: string;
}

export type IEntities = IEntity[];

export interface ILogger {
  log: Function;
  info: Function;
  warn: Function;
  error: Function;
}

export type IHandlers = Map<string, Function>;

export type status = 'TRAINING' | 'AVAILABLE' | 'UNAVAILABLE' | 'UNKNOWN';

export interface IAdapter {
  // get current status of workspace
  // ex: Training, Available, etc
  getWorkspaceStatus(): Promise<status>;

  // apply the current routes, intents, entities, etc
  // to the provider - this should wait until the provider is done training and then
  // resolve
  applyChanges({ routes, intents, entities }): Promise<{}>;

  // send the message to the provider and return the
  // message to be sent to the user
  sendMessage(msg: string, to?: string, context?: object): Promise<{
    conversationId: string;
    context: object;
    intents: object[];
    entities: object[];
    templateId: string;
  }>;
}
