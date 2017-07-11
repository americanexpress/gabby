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
  IAdapter,
  IRoutes,
  IIntents,
  IEntities,
  IHandlers,
  ILogger,
} from 'gabby-types';

// create a map of handlers
import createHandlers from './utils/createHandlers';

export interface IGabby {
  adapter: IAdapter;
  routes?: IRoutes;
  intents?: IIntents;
  entities?: IEntities;
  logger?: ILogger;
}

export class Gabby {
  private dirty: boolean = true;
  private handlers: IHandlers;
  private _adapter: IAdapter;
  private _routes: IRoutes;
  private _intents: IIntents;
  private _entities: IEntities;
  private _logger: ILogger;

  private contexts = new Map<string, object>();

  constructor({
    adapter,
    routes,
    intents = [],
    entities = [],
    logger = null,
  } : IGabby) {
    this.adapter = adapter;
    this.routes = routes;
    this.intents = intents;
    this.entities = entities;
    this.logger = logger;
  }

  async applyChanges() {
    try {
      this.handlers = createHandlers(this.routes);
      await this.adapter.applyChanges({
        routes: this.routes,
        intents: this.intents,
        entities: this.entities,
      });
      this.dirty = false;
    } catch (e) {
      throw e;
    }
  }

  async sendMessage(message: string, to?: string) {
    if (!this.routes) {
      return Promise.reject(new Error('No routes specified'));
    }

    if (this.dirty) {
      return Promise.reject(new Error('You have not applied your changes yet.'));
    }

    const {
      conversationId,
      context,
      intents,
      entities,
      templateId
    } = await this.adapter.sendMessage(message, to, this.contexts.get(to));

    this.contexts.set(conversationId, context);

    if (!templateId) {
      return Promise.reject(new Error('No template specified'));
    }

    const template = this.handlers.get(templateId);

    if (!template) {
      return Promise.reject(new Error(`${templateId} has not been setup.`));
    }

    // handle promises as well as non-promise values
    const msg = await new Promise(res => res(
      template({ context, intents, entities }),
    ));

    return Promise.resolve({
      msg,
      conversationId,
    });
  }

  get routes(): IRoutes {
    return this._routes;
  }

  set routes(routes: IRoutes) {
    this.dirty = true;
    this._routes = routes;
  }

  get intents(): IIntents {
    return this._intents;
  }

  set intents(intents: IIntents) {
    this.dirty = true;
    this._intents = intents;
  }

  get entities(): IEntities {
    return this._entities;
  }

  set entities(entities: IEntities) {
    this.dirty = true;
    this._entities = entities;
  }

  get adapter() {
    return this._adapter;
  }

  set adapter(adapter: IAdapter) {
    this.dirty = true;
    this._adapter = adapter;
  }

  get logger() {
    return this._logger;
  }

  set logger(logger: ILogger) {
    this.dirty = true;
    this._logger = logger;
  }
}

export default Gabby;
