import { ConversationV1 } from 'watson-developer-cloud';
import * as logUpdate from 'log-update';

import { IWatsonProps, IWatsonCredentials, IRoutes, IIntents, IEntities, IHandlers } from '../interfaces';

import parseReactRoutes from '../parseReactRoutes';
import createDialogTree from '../createDialogTree';
import createIntents from '../createIntents';
import createEntities from '../createEntities';
// create a map of handlers
import createHandlers from '../createHandlers';

function timeout(ms = 1000) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export class Watson extends ConversationV1 {
  private credentials: IWatsonCredentials;
  private routes: IRoutes;
  private intents: IIntents;
  private entities: IEntities;
  private handlers: IHandlers;

  private contexts = new Map<string, object>();

  constructor({ credentials, routes, intents = [], entities = [] }: IWatsonProps) {
    super({
      username: credentials.username,
      password: credentials.password,
      version_date: ConversationV1.VERSION_DATE_2017_04_21,
    });

    this.credentials = credentials;
    this.routes = routes;
    this.intents = intents;
    this.entities = entities;
    this.handlers = createHandlers(routes);
  }

  init() {
    const dialog_nodes = createDialogTree(this.routes);
    const parsedIntents = createIntents(this.intents);
    const parsedEntities = createEntities(this.entities);

    return new Promise((resolve, reject) => {
      this.updateWorkspace({
        workspace_id: this.credentials.workspaceId,
        name: 'watson test',
        description: 'watson testing',
        dialog_nodes,
        intents: parsedIntents,
        entities: parsedEntities,
      }, async (err, data) => {
        if (!err) {
          console.log('Done with initialization.');
          let step = 0;
          while(true) {
            await timeout(1000);
            step = step + 1 > 3 ? 0 : step + 1;
            const dots = '.'.repeat(step);
            const status = await new Promise(rs => {
              this.getWorkspace({
                workspace_id: this.credentials.workspaceId,
              }, (err, data) => {
                if (err) {
                  return reject(err);
                }

                return rs(data.status);
              });
            });

            if (status === 'Training') {
              logUpdate(`Training${dots}`);
            } else if (status === 'Available') {
              console.log('Done training.');
              break;
            } else {
              console.log('unhandled', status);
            }
          }
          return resolve();
        } else {
          console.error(err);
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

  setRoutes(routes: IRoutes) {
    // set our routes and upload them
  }
}

export default Watson;
