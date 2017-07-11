import { ConversationV1 } from 'watson-developer-cloud';
import { IAdapter, ILogger, status } from 'gabby-types';

import createDialogTree from './utils/createDialogTree';
import createIntents from './utils/createIntents';
import createEntities from './utils/createEntities';

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

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default class Watson implements IAdapter {
  private client: ConversationV1;

  private workspaceName: string;
  private credentials: IWatsonCredentials;
  private logger: ILogger;

  private statusPollRate;
  private maxStatusPollCount;

  constructor({
    name,
    username,
    password,
    workspaceId,
    statusPollRate = 3000,
    maxStatusPollCount = 30,
    logger
  }: IWatson) {
    this.workspaceName = name;
    this.credentials = {
      username,
      password,
      workspaceId,
    };
    this.statusPollRate = statusPollRate;
    this.maxStatusPollCount = maxStatusPollCount;
    this.logger = logger;

    this.client = new ConversationV1({
      username,
      password,
      workspace_id: workspaceId,
      version_date: ConversationV1.VERSION_DATE_2017_04_21,
    });
  }

  applyChanges({ routes, intents, entities }) {
    const parsedDialogTree = createDialogTree(routes);
    const parsedIntents = createIntents(intents);
    const parsedEntities = createEntities(entities);

    return new Promise((resolve, reject) => {
      this.client.updateWorkspace({
        dialog_nodes: parsedDialogTree,
        intents: parsedIntents,
        entities: parsedEntities,
        name: this.workspaceName,
        workspace_id: this.credentials.workspaceId,
        description: '',
      }, async (err) => {
        if (err) {
          return reject(err);
        }

        /* istanbul ignore next */
        if (this.logger) {
          this.logger.log('Done with initialization.');
        }

        for (let pollCount = 0; pollCount < this.maxStatusPollCount; pollCount++) {
          try {
            const status = await this.getWorkspaceStatus();
            switch (status) {
              case 'TRAINING': {
                /* istanbul ignore next */
                if (this.logger) {
                  this.logger.log('Training...');
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
          } catch (e) {
            return reject(e);
          }

          await timeout(this.statusPollRate);
        }

        return reject(new Error('Apply changes timed out.'));
      });
    });
  }

  getWorkspaceStatus() {
    return new Promise<status>((resolve, reject) => {
      this.client.getWorkspace({
        workspace_id: this.credentials.workspaceId,
      }, (err, data: { status: string }) => {
        if (err) {
          return reject(err);
        }

        return resolve(<status>data.status.toUpperCase());
      });
    });
  }

  sendMessage(msg: string, to?: string, context = {}) {
    return new Promise<{
      conversationId: string;
      templateId: string;
      intents: object[];
      entities: object[];
      context: object,
    }>((resolve, reject) => {
      this.client.message({
        context,
        input: { text: msg },
        workspace_id: this.credentials.workspaceId,
      }, (err, response) => {
        if (err) {
          return reject(err);
        }

        const { conversation_id: conversationId } = response.context;
        const { template: templateId } = response.output.values[0];
        const { intents = [], entities = [] } = response;

        if (!templateId) {
          return reject(new Error('No template specified'));
        }

        return resolve({
          conversationId,
          templateId,
          intents,
          entities,
          context: response.context,
        });
      });
    });
  }
}
