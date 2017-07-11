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

import WatsonAdapter from '../src/index';

describe('Watson Gabby Adapter', () => {
  describe('Apply Changes', () => {
    it('should return a promise', () => {
      const adapter = new WatsonAdapter({
        name: 'test',
        username: 'test',
        password: 'test',
        workspaceId: 'test',
      });

      const res = adapter.applyChanges({
        routes: {
          children: [],
        },
        intents: [],
        entities: [],
      });

      expect(res).toEqual(expect.any(Promise));
    });

    it('should reject if update workspace returns an error', async () => {
      const adapter = new WatsonAdapter({
        name: 'test',
        username: 'test',
        password: 'test',
        workspaceId: 'test',
      });

      (<jest.Mock<any>>adapter['client'].updateWorkspace).mockImplementation((data, cb) => {
        cb(new Error('test error'));
      });

      try {
        await adapter.applyChanges({
          routes: {
            children: [],
          },
          intents: [],
          entities: [],
        });
      } catch (e) {
        expect(e).toEqual(new Error('test error'));
      }
    });

    it('should poll service for status', async () => {
      const adapter = new WatsonAdapter({
        name: 'test',
        username: 'test',
        password: 'test',
        workspaceId: 'test',
      });

      (<jest.Mock<any>>adapter['client'].updateWorkspace).mockImplementation((data, cb) => {
        cb();
      });

      (<jest.Mock<any>>adapter['client'].getWorkspace).mockImplementation((data, cb) => {
        cb();
      });

      let count = 0;
      const vals = [
        'TRAINING',
        'AVAILABLE',
      ];

      adapter['getWorkspaceStatus'] = jest.fn(() => {
        const status = vals[count];
        count++;
        return Promise.resolve(status);
      });

      await adapter.applyChanges({
        routes: {
          children: [],
        },
        intents: [],
        entities: [],
      });
    });

    it('should poll service for status and reject if unhandled status is found', async () => {
      const adapter = new WatsonAdapter({
        name: 'test',
        username: 'test',
        password: 'test',
        workspaceId: 'test',
      });

      (<jest.Mock<any>>adapter['client'].updateWorkspace).mockImplementation((data, cb) => {
        cb();
      });

      (<jest.Mock<any>>adapter['client'].getWorkspace).mockImplementation((data, cb) => {
        cb();
      });

      let count = 0;
      const vals = [
        'testing_unhandled_status',
      ];

      adapter['getWorkspaceStatus'] = jest.fn(() => {
        const status = vals[count];
        count++;
        return Promise.resolve(status);
      });

      try {
        await adapter.applyChanges({
          routes: {
            children: [],
          },
          intents: [],
          entities: [],
        });
      } catch (e) {
        expect(e).toEqual(new Error('unhandled app status testing_unhandled_status'));
      }
    });

    it('should poll service for status and reject if get workspace fails', async () => {
      const adapter = new WatsonAdapter({
        name: 'test',
        username: 'test',
        password: 'test',
        workspaceId: 'test',
      });

      (<jest.Mock<any>>adapter['client'].updateWorkspace).mockImplementation((data, cb) => {
        cb();
      });

      adapter['getWorkspaceStatus'] = jest.fn(() => Promise.reject(new Error('testing_error')));

      try {
        await adapter.applyChanges({
          routes: {
            children: [],
          },
          intents: [],
          entities: [],
        });
      } catch (e) {
        expect(e).toEqual(new Error('testing_error'));
      }
    });

    it('should reject if timed out', async () => {
      const adapter = new WatsonAdapter({
        name: 'test',
        username: 'test',
        password: 'test',
        workspaceId: 'test',
        statusPollRate: 1,
        maxStatusPollCount: 1,
      });

      (<jest.Mock<any>>adapter['client'].updateWorkspace).mockImplementation((data, cb) => {
        cb();
      });

      (<jest.Mock<any>>adapter['client'].getWorkspace).mockImplementation((data, cb) => {
        cb();
      });

      adapter['getWorkspaceStatus'] = jest.fn(() => {
        return Promise.resolve('TRAINING');
      });

      try {
        await adapter.applyChanges({
          routes: {
            children: [],
          },
          intents: [],
          entities: [],
        });
      } catch (e) {
        expect(e).toEqual(new Error('Apply changes timed out.'));
      }
    });
  });

  describe('Get Workspace Status', () => {
    it('should return a promise', () => {
      const adapter = new WatsonAdapter({
        name: 'test',
        username: 'test',
        password: 'test',
        workspaceId: 'test',
      });

      const res = adapter.getWorkspaceStatus();

      expect(res).toEqual(expect.any(Promise));
    });

    it('should reject if there is an error', async () => {
      const adapter = new WatsonAdapter({
        name: 'test',
        username: 'test',
        password: 'test',
        workspaceId: 'test',
      });

      (<jest.Mock<any>>adapter['client'].getWorkspace).mockImplementation((data, cb) => {
        cb(new Error('testing_error'));
      });

      try {
        await adapter.getWorkspaceStatus();
      } catch (e) {
        expect(e).toEqual(new Error('testing_error'));
      }
    });

    it('should resolve with status if there is no error', async () => {
      const adapter = new WatsonAdapter({
        name: 'test',
        username: 'test',
        password: 'test',
        workspaceId: 'test',
      });

      (<jest.Mock<any>>adapter['client'].getWorkspace).mockImplementation((data, cb) => {
        cb(null, { status: 'testing_status' });
      });

      const status = await adapter.getWorkspaceStatus();
      expect(status).toBe('TESTING_STATUS');
    });
  });

  describe('Send Message', () => {
    it('should return a promise', () => {
      const adapter = new WatsonAdapter({
        name: 'test',
        username: 'test',
        password: 'test',
        workspaceId: 'test',
      });

      const res = adapter.sendMessage('test', 'test');

      expect(res).toEqual(expect.any(Promise));
    });

    it('should reject if there is an error', async () => {
      const adapter = new WatsonAdapter({
        name: 'test',
        username: 'test',
        password: 'test',
        workspaceId: 'test',
      });

      (<jest.Mock<any>>adapter['client'].message).mockImplementation((data, cb) => {
        cb(new Error('testing_error'));
      });

      try {
        await adapter.sendMessage('test', 'to');
      } catch (e) {
        expect(e).toEqual(new Error('testing_error'));
      }
    });

    it('should reject if there is no template id', async () => {
      const adapter = new WatsonAdapter({
        name: 'test',
        username: 'test',
        password: 'test',
        workspaceId: 'test',
      });

      (<jest.Mock<any>>adapter['client'].message).mockImplementation((data, cb) => {
        cb(null, {
          context: { conversation_id: 'testing' },
          output: { values: [{ template: null }] }
        });
      });

      try {
        await adapter.sendMessage('test', 'to');
      } catch (e) {
        expect(e).toEqual(new Error('No template specified'));
      }
    });

    it('should resolve if there is no template id', async () => {
      const adapter = new WatsonAdapter({
        name: 'test',
        username: 'test',
        password: 'test',
        workspaceId: 'test',
      });

      (<jest.Mock<any>>adapter['client'].message).mockImplementation((data, cb) => {
        cb(null, {
          intents: [],
          entities: [],
          context: { conversation_id: 'testing' },
          output: { values: [{ template: 'test_id' }] }
        });
      });

      const { templateId, conversationId } = await adapter.sendMessage('test', 'to', {});
      expect(templateId).toBe('test_id');
      expect(conversationId).toBe('testing');
    });
  });
});
