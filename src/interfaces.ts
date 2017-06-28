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
  name: string;
  to?: string;
  when: string;
  handler: Function;
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

export interface IWatsonCredentials {
  username: string;
  password: string;
  workspaceId: string;
}

export interface ILogger {
  log: Function;
  info: Function;
  warn: Function;
  error: Function;
}

export interface IWatsonProps {
  routes?: IRoutes;
  intents?: IIntents;
  entities?: IEntities;
  credentials: IWatsonCredentials;
  name?: string;
  logger?: ILogger;
  maxStatusPollCount?: number;
  statusPollRate?: number;
}

export type IHandlers = Map<string, Function>;
