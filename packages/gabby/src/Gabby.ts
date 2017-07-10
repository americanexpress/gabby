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
 
import {
  IRoutes,
  IIntents,
  IEntities,
  IHandlers,
  ILogger,
} from './interfaces';

import IGabbyAdapter from './Adapter';

import createDialogTree from './utils/createDialogTree';
import createIntents from './utils/createIntents';
import createEntities from './utils/createEntities';
// create a map of handlers
import createHandlers from './utils/createHandlers';

export class Gabby {
  private adapter: IGabbyAdapter;
  private routes: IRoutes;
  private intents: IIntents;
  private entities: IEntities;
  private handlers: IHandlers;
  private logger: ILogger;

  // how many times to poll before giving up
  private maxStatusPollCount: number;
  // how quickly to poll
  private statusPollRate: number; // ms

  private contexts = new Map<string, object>();

  constructor({
    adapter,
    routes,
    intents = [],
    entities = [],
    logger,
    maxStatusPollCount = 30,
    statusPollRate = 3000,
  }) {
    this.adapter = adapter;
    this.routes = routes;
    this.intents = intents;
    this.entities = entities;
    this.logger = logger;

    this.maxStatusPollCount = maxStatusPollCount;
    this.statusPollRate = statusPollRate;
    this.handlers = createHandlers(this.routes);
  }

  sendMessage(msg: string, to?: string) {
    if (!this.routes) {
      return Promise.reject(new Error('No routes specified'));
    }

    return new Promise((resolve, reject) => {
      this.adapter.sendMessage(msg, to, this.contexts.get(to))
        .then(async ({ conversationId, context, intents, entities, templateId }) => {

          this.contexts.set(conversationId, context);

          if (!templateId) {
            return reject(new Error('No template specified'));
          }

          const template = this.handlers.get(templateId);

          if (!template) {
            return reject(new Error(`${templateId} has not been setup.`));
          }

          // handle promises as well as non-promise values
          const msg = await new Promise(res => res(
            template({ context, intents, entities }),
          ));

          return resolve({
            msg,
            conversationId,
          });
        });
    });
  }

  applyChanges() {
    const parsedDialogTree = createDialogTree(this.routes);
    const parsedIntents = createIntents(this.intents);
    const parsedEntities = createEntities(this.entities);

    this.handlers = createHandlers(this.routes);

    return this.adapter.applyChanges({
      routes: parsedDialogTree,
      intents: parsedIntents,
      entities: parsedEntities,
    });
  }

  getRoutes(): IRoutes {
    return this.routes;
  }

  setRoutes(routes: IRoutes) {
    this.routes = routes;
    return this;
  }

  getIntents(): IIntents {
    return this.intents;
  }

  setIntents(intents: IIntents) {
    this.intents = intents;
    return this;
  }

  getEntities(): IEntities {
    return this.entities;
  }

  setEntities(entities: IEntities) {
    this.entities = entities;
    return this;
  }
}

export default Gabby;
