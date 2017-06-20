import { ConversationV1 } from 'watson-developer-cloud';
import * as logUpdate from 'log-update';

import {
  IWatsonProps,
  IWatsonCredentials,
  IRoutes,
  IIntents,
  IEntities,
  IHandlers,
  ILogger,
} from '../interfaces';

import parseReactRoutes from '../parseReactRoutes';
import createDialogTree from '../createDialogTree';
import createIntents from '../createIntents';
import createEntities from '../createEntities';
// create a map of handlers
import createHandlers from '../createHandlers';

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class Gab extends ConversationV1 {
  private workspaceName: string;
  private credentials: IWatsonCredentials;
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
    name = '',
    credentials,
    routes,
    intents = [],
    entities = [],
    logger,
    maxStatusPollCount = 30,
    statusPollRate = 3000,
  }: IWatsonProps) {
    super({
      username: credentials.username,
      password: credentials.password,
      version_date: ConversationV1.VERSION_DATE_2017_04_21,
    });

    this.workspaceName = name;
    this.credentials = credentials;
    this.routes = routes;
    this.intents = intents;
    this.entities = entities;
    this.logger = logger;

    this.maxStatusPollCount = maxStatusPollCount;
    this.statusPollRate = statusPollRate;
    this.handlers = createHandlers(this.routes);
  }

  getWorkspaceStatus() {
    return new Promise((resolve, reject) => {
      this.getWorkspace({
        workspace_id: this.credentials.workspaceId,
      }, (err, data: { status: string }) => {
        if (err) {
          return reject(err);
        }

        return resolve(data.status.toUpperCase());
      });
    });
  }

  // apply the current routes, intents, entities, etc
  // to watson - this will wait until Watson is done training and then
  // resolve
  applyChanges() {
    const parsedDialogTree = createDialogTree(this.routes);
    const parsedIntents = createIntents(this.intents);
    const parsedEntities = createEntities(this.entities);

    this.handlers = createHandlers(this.routes);

    return new Promise((resolve, reject) => {
      this.updateWorkspace({
        workspace_id: this.credentials.workspaceId,
        name: this.workspaceName,
        description: '',
        dialog_nodes: parsedDialogTree,
        intents: parsedIntents,
        entities: parsedEntities,
      }, async (err) => {
        if (!err) {
          if (this.logger) {
            this.logger.log('Done with initialization.');
          }

          for (let pollCount = 0; pollCount < this.maxStatusPollCount; pollCount++) {
            try {
              const status = await this.getWorkspaceStatus();
              switch (status) {
                case 'TRAINING': {
                  if (this.logger) {
                    this.logger.log('Training...');
                  }
                  break;
                }
                case 'AVAILABLE': {
                  if (this.logger) {
                    this.logger.log('Done training.');
                  }
                  return resolve();
                }
                default: {
                  if (this.logger) {
                    this.logger.error('unhandled', status);
                  }
                  return reject(new Error(`unhandled app status ${status}`));
                }
              }
            } catch (e) {
              return reject(e);
            }

            await timeout(this.statusPollRate);
          }
        } else {
          return reject(err);
        }
      });
    });
  }

  sendMessage(msg: string, to?: string) {
    if (!this.routes) {
      return Promise.reject(new Error('No routes specified'));
    }

    return new Promise((resolve, reject) => {
      this.message({
        context: this.contexts.get(to) || {},
        input: { text: msg },
        workspace_id: this.credentials.workspaceId,
      }, (err, response) => {
        if (err) {
          return reject(err);
        }

        const conversationId = response.context.conversation_id;

        this.contexts.set(conversationId, response.context);

        if (response.output && response.output.values && response.output.values.length > 0) {
          const { template: templateId } = response.output.values[0];

          if (!templateId) {
            return reject(new Error('No template specified'));
          }

          const template = this.handlers.get(templateId);

          if (!template) {
            return reject(new Error(`${templateId} has not been setup.`));
          }

          return resolve({
            conversationId,
            msg: template({ raw: response, context: response.context }),
          });
        } else {
          if (this.logger) {
            // tslint:disable-next-line:max-line-length
            this.logger.warn(
              `Got unexpected response output from watson: ${JSON.stringify(response.output, null, 2)}`,
            );
          }

          return reject(new Error('Incorrect output received'));
        }
      });
    });
  }

  getWorkspaceName() {
    return this.workspaceName;
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

export default Gab;
