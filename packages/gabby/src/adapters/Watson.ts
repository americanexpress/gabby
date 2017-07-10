import { ConversationV1 } from 'watson-developer-cloud';
import IGabbyAdapter, { status  from '../Adapter';
import timeout from '../utils/timeout';
import { ILogger } from '../interfaces';

export interface IWatsonCredentials {
  username: string;
  password: string;
  workspaceId: string;
}

export interface IWatson extends IWatsonCredentials {
  name: string;
  logger: ILogger;
}

export default class Watson implements IGabbyAdapter {
  private client: ConversationV1;

  private workspaceName: string;
  private credentials: IWatsonCredentials;
  private logger: ILogger;

  private statusPollRate = 3000;
  private maxStatusPollCount = 30;

  constructor({ name, username, password, workspaceId, logger }: IWatson) {
    this.workspaceName = name;
    this.credentials = {
      username,
      password,
      workspaceId,
    };
    this.logger = logger;

    this.client = new ConversationV1({
      username,
      password,
      workspace_id: workspaceId,
    });
  }

  applyChanges({ routes: dialog_nodes, intents, entities }) {
    return new Promise((resolve, reject) => {
      this.client.updateWorkspace({
        dialog_nodes,
        intents,
        entities,
        name: this.workspaceName,
        workspace_id: this.credentials.workspaceId,
        description: '',
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
                  return Promise.resolve();
                }
                default: {
                  if (this.logger) {
                    this.logger.error('unhandled', status);
                  }
                  return Promise.reject(new Error(`unhandled app status ${status}`));
                }
              }
            } catch (e) {
              return Promise.reject(e);
            }

            await timeout(this.statusPollRate);
          }
        } else {
          return reject(err);
        }
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

        return resolve(data.status.toUpperCase());
      });
    });
  }

  sendMessage(msg: string, to?: string, context = {}) {
    return new Promise((resolve, reject) => {
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
        });
      });
    });
  }
}
