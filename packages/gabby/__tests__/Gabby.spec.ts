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
 
import Gabby from '../src/Gabby';
import { IAdapter, IRoutes, IIntents, IEntities } from 'gabby-types';

class TestAdapter implements IAdapter {
  public applyChanges = jest.fn(() => Promise.resolve({}));
  public getWorkspaceStatus = jest.fn(() => Promise.resolve('AVAILABLE'));
  public sendMessage = jest.fn(() => {});
}

describe('Gabby', () => {
  describe('Construction', () => {
    it('should not default to array for intents and entities if provided', () => {
      const intents = [
        {
          name: 'test',
          description: 'testing',
          phrases: ['test']
        }
      ];
      const entities = [
        {
          name: 'test',
          description: 'testing',
          values: [
            {
              name: 'test',
              synonyms: ['test']
            }
          ],
          fuzzy: true,
        }
      ];

      const gabby = new Gabby({
        intents,
        entities,
        adapter: new TestAdapter(),
        routes: {
          children: [
            {
              name: 'mocked.again.Goodbye',
              when: '#test',
              handler: () => 'Goodbye',
              children: [],
            },
            {
              name: 'mocked.again.Help',
              when: '#help',
              handler: () => 'Help',
              children: [],
            },
          ],
        },
      });

      expect(gabby.intents).toEqual(intents);
      expect(gabby.entities).toEqual(entities);
    });

    it('should default to array for intents and entites if not provided', () => {
      const gabby = new Gabby({
        adapter: new TestAdapter(),
        routes: {
          children: [
            {
              name: 'mocked.again.Goodbye',
              when: '#test',
              handler: () => 'Goodbye',
              children: [],
            },
            {
              name: 'mocked.again.Help',
              when: '#help',
              handler: () => 'Help',
              children: [],
            },
          ],
        },
      });

      expect(gabby.intents).toEqual([]);
      expect(gabby.entities).toEqual([]);
    });

    it('should not default to null for logger if provided', () => {
      const gabby = new Gabby({
        adapter: new TestAdapter(),
        routes: {
          children: [
            {
              name: 'mocked.again.Goodbye',
              when: '#test',
              handler: () => 'Goodbye',
              children: [],
            },
            {
              name: 'mocked.again.Help',
              when: '#help',
              handler: () => 'Help',
              children: [],
            },
          ],
        },
        logger: console,
      });
      
      expect(gabby.logger).toEqual(console);
    });

    it('should default to null for logger if not provided', () => {
      const gabby = new Gabby({
        adapter: new TestAdapter(),
        routes: {
          children: [
            {
              name: 'mocked.again.Goodbye',
              when: '#test',
              handler: () => 'Goodbye',
              children: [],
            },
            {
              name: 'mocked.again.Help',
              when: '#help',
              handler: () => 'Help',
              children: [],
            },
          ],
        },
      });
      
      expect(gabby.logger).toEqual(null);
    });

    it('should set adapter if provided', () => {
      const adapter = new TestAdapter();
      const gabby = new Gabby({
        adapter,
        routes: {
          children: [
            {
              name: 'mocked.again.Goodbye',
              when: '#test',
              handler: () => 'Goodbye',
              children: [],
            },
            {
              name: 'mocked.again.Help',
              when: '#help',
              handler: () => 'Help',
              children: [],
            },
          ],
        },
      });
      
      expect(gabby.adapter).toEqual(adapter);
    });
  });

  describe('Apply Changes', () => {
    it('should set route handlers', async () => {
      const gabby = new Gabby({
        adapter: new TestAdapter(),
        routes: {
          children: [
            {
              name: 'mocked.again.Goodbye',
              when: '#test',
              handler: () => 'Goodbye',
              children: [],
            },
            {
              name: 'mocked.again.Help',
              when: '#help',
              handler: () => 'Help',
              children: [],
            },
          ],
        },
      });

      await gabby.applyChanges();
      expect(gabby['handlers']).toEqual(expect.any(Map));
    });

    it('should throw error if adapter is unable to apply changes to provider', async () => {
      const adapter = new TestAdapter();
      adapter.applyChanges.mockReturnValue(Promise.reject(new Error('test error')));

      const gabby = new Gabby({
        adapter,
        routes: {
          children: [
            {
              name: 'mocked.again.Goodbye',
              when: '#test',
              handler: () => 'Goodbye',
              children: [],
            },
            {
              name: 'mocked.again.Help',
              when: '#help',
              handler: () => 'Help',
              children: [],
            },
          ],
        },
      });

      try {
        await gabby.applyChanges();
      } catch (e) {
        expect(e).toEqual(new Error('test error'));
      }
    });
  });

  describe('Send Message', () => {
    it('should reject if no routes have been specified', async () => {
      const gabby = new Gabby({
        adapter: new TestAdapter(),
      });

      try {
        await gabby.sendMessage('test', 'asdf')
      } catch (e) {
        expect(e).toEqual(new Error('No routes specified'));
      }
    });

    it('should reject if changes have not been synced', async () => {
      const gabby = new Gabby({
        adapter: new TestAdapter(),
        routes: {
          children: [
            {
              name: 'mocked.again.Goodbye',
              when: '#test',
              handler: () => 'Goodbye',
              children: [],
            },
            {
              name: 'mocked.again.Help',
              when: '#help',
              handler: () => 'Help',
              children: [],
            },
          ],
        },
      });

      try {
        await gabby.sendMessage('test', 'asdf')
      } catch (e) {
        expect(e).toEqual(new Error('You have not applied your changes yet.'));
      }
    });

    it('should return a promise', async () => {
      const gabby = new Gabby({
        adapter: new TestAdapter(),
        routes: {
          children: [
            {
              name: 'mocked.again.Goodbye',
              when: '#test',
              handler: () => 'Goodbye',
              children: [],
            },
            {
              name: 'mocked.again.Help',
              when: '#help',
              handler: () => 'Help',
              children: [],
            },
          ],
        },
      });

      await gabby.applyChanges();

      expect(gabby.sendMessage('test', 'asdf')).toEqual(expect.any(Promise));
    });

    it('should reject if no template id is returned', async () => {
      const adapter = new TestAdapter();
      adapter.sendMessage.mockReturnValue(Promise.resolve({
        templateId: null,
      }));

      const gabby = new Gabby({
        adapter,
        routes: {
          children: [
            {
              name: 'mocked.again.Goodbye',
              when: '#test',
              handler: () => 'Goodbye',
              children: [],
            },
            {
              name: 'mocked.again.Help',
              when: '#help',
              handler: () => 'Help',
              children: [],
            },
          ],
        },
      });

      await gabby.applyChanges();

      try {
        await gabby.sendMessage('test', 'asdf')
      } catch (e) {
        expect(e).toEqual(new Error('No template specified'));
      }
    });

    it('should reject if the template cannot be found', async () => {
      const adapter = new TestAdapter();
      adapter.sendMessage.mockReturnValue(Promise.resolve({
        templateId: 'missing',
      }));

      const gabby = new Gabby({
        adapter,
        routes: {
          children: [
            {
              name: 'mocked.again.Goodbye',
              when: '#test',
              handler: () => 'Goodbye',
              children: [],
            },
            {
              name: 'mocked.again.Help',
              when: '#help',
              handler: () => 'Help',
              children: [],
            },
          ],
        },
      });

      await gabby.applyChanges();

      try {
        await gabby.sendMessage('test', 'asdf')
      } catch (e) {
        expect(e).toEqual(new Error('missing has not been setup.'));
      }
    });

    it('should resolve with the message and conversation id', async () => {
      const adapter = new TestAdapter();
      adapter.sendMessage.mockReturnValue(Promise.resolve({
        templateId: 'mocked.again.Goodbye',
        conversationId: 'testid',
      }));

      const gabby = new Gabby({
        adapter,
        routes: {
          children: [
            {
              name: 'mocked.again.Goodbye',
              when: '#test',
              handler: () => 'Goodbye',
              children: [],
            },
            {
              name: 'mocked.again.Help',
              when: '#help',
              handler: () => 'Help',
              children: [],
            },
          ],
        },
      });

      await gabby.applyChanges();

      const { msg, conversationId } = await gabby.sendMessage('test', 'asdf');
      expect(msg).toBe('Goodbye');
      expect(conversationId).toBe('testid');
    });
  });
});
