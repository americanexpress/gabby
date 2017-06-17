import { ConversationV1 } from 'watson-developer-cloud';
import * as logUpdate from 'log-update';

import { IWatsonProps, IWatsonCredentials, IRoutes, IIntents, IEntities, IHandlers, ILogger } from '../interfaces';

import parseReactRoutes from '../parseReactRoutes';
import createDialogTree from '../createDialogTree';
import createIntents from '../createIntents';
import createEntities from '../createEntities';
// create a map of handlers
import createHandlers from '../createHandlers';

function timeout(ms = 1000) {
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

  private contexts = new Map<string, object>();

  constructor({ name = '', credentials, routes, intents = [], entities = [], logger }: IWatsonProps) {
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
  }

  // apply the current routes, intents, entities, etc
  // to watson - this will wait until Watson is done training and then
  // resolve
  applyChanges() {
    const dialog_nodes = createDialogTree(this.routes);
    const parsedIntents = createIntents(this.intents);
    const parsedEntities = createEntities(this.entities);

    this.handlers = createHandlers(this.routes);

    return new Promise((resolve, reject) => {
      this.updateWorkspace({
        workspace_id: this.credentials.workspaceId,
        name: this.workspaceName,
        description: '',
        dialog_nodes,
        intents: parsedIntents,
        entities: parsedEntities,
      }, async (err) => {
        if (!err) {
          /* istanbul ignore next */
          if (this.logger) {
            this.logger.log('Done with initialization.');
          }
          
          let step = 0;
          while(true) {
            await timeout(1000);
            step = step + 1 > 3 ? 0 : step + 1;
            const dots = '.'.repeat(step);
            const status = await new Promise(rs => {
              this.getWorkspace({
                workspace_id: this.credentials.workspaceId,
              }, (err, data: { status: string }) => {
                if (err) {
                  return reject(err);
                }

                return rs(data.status.toUpperCase());
              });
            });

            switch(status) {
              case 'TRAINING': {
                /* istanbul ignore next */
                if (this.logger) {
                  this.logger.log(`Training${dots}`);
                }
                break;
              }
              case 'AVAILABLE': {
                /* istanbul ignore next */
                if (this.logger) {
                  this.logger.log('Done training.');
                }
                return resolve();
              }
              default: {
                /* istanbul ignore next */
                if (this.logger) {
                  this.logger.error('unhandled', status);
                }
                return reject(new Error(`unhandled app status ${status}`));
              }
            }
          }
        } else {
          return reject(err);
        }
      });
    });
  }

  sendMessage(msg: string, to?: string) {
    return new Promise((resolve, reject) => {
      this.message({
        context: this.contexts.get(to) || {},
        input: { text: msg },
        workspace_id: this.credentials.workspaceId,
      }, (err, response) => {
          if (err) {
            return reject(err);
          }

          this.contexts.set(response.context.conversation_id, response.context);

          if (response.output && response.output.values && response.output.values.length > 0) {
            const { template: templateId } = response.output.values[0];

            if (!templateId) {
              return reject(new Error('No template specified'));
            }

            const template = this.handlers.get(templateId);

            if (!template) {
              return reject(new Error(`${templateId} has not been setup.`));
            }

            return resolve(template({ raw: response, context: response.context }));
          } else {
            console.log(response);
            throw new Error('incorrect output received.');
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
