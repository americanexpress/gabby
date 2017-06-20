import Gab from '../../src/Gab';
import { IRoutes, IIntents, IEntities } from '../../src/interfaces';

interface MockedGab extends Gab {
  mock: Function;
}

describe('Gab', () => {
  it('should set routes', () => {
    const client = new Gab({
      name: 'test',
      credentials: {
        username: 'test',
        password: 'test',
        workspaceId: 'test',
      },
    });

    const routes: IRoutes = {
      name: 'test',
      when: '#testing',
      handler: () => {},
      children: [],
    };

    client.setRoutes(routes);
    expect(client.getRoutes()).toEqual(routes);
  });

  it('should set intents', () => {
    const client = new Gab({
      name: 'test',
      credentials: {
        username: 'test',
        password: 'test',
        workspaceId: 'test',
      },
    });

    const intents: IIntents = [
      {
        name: 'test',
        phrases: ['testing'],
        description: 'testing',
      },
    ];

    client.setIntents(intents);
    expect(client.getIntents()).toEqual(intents);
  });

  it('should set entities', () => {
    const client = new Gab({
      name: 'test',
      credentials: {
        username: 'test',
        password: 'test',
        workspaceId: 'test',
      },
    });

    const entities: IEntities = [
      {
        name: 'test',
        values: [
          {
            name: 'test',
            synonyms: ['test'],
          },
        ],
        fuzzy: true,
        description: 'testing',
      },
    ];

    client.setEntities(entities);
    expect(client.getEntities()).toEqual(entities);
  });

  it('should use defaults for intents, entities, and name if not supplied', () => {
    const client = new Gab({
      credentials: {
        username: 'test',
        password: 'test',
        workspaceId: 'test',
      },
    });

    expect(client.getWorkspaceName()).toEqual('');
    expect(client.getIntents()).toEqual([]);
    expect(client.getEntities()).toEqual([]);
  });

  it('should not use defaults for intents, entities, and name if supplied', () => {
    const intents: IIntents = [
      {
        name: 'test',
        phrases: ['testing'],
        description: 'testing',
      },
    ];

    const entities: IEntities = [
      {
        name: 'test',
        values: [
          {
            name: 'test',
            synonyms: ['test'],
          },
        ],
        fuzzy: true,
        description: 'testing',
      },
    ];

    const client = new Gab({
      intents,
      entities,
      name: 'test',
      credentials: {
        username: 'test',
        password: 'test',
        workspaceId: 'test',
      },
    });

    expect(client.getWorkspaceName()).toEqual('test');
    expect(client.getIntents()).toEqual(intents);
    expect(client.getEntities()).toEqual(entities);
  });

  describe('apply changes', () => {
    it('should push changes to watson when apply changes is called', (done) => {
      const routes: IRoutes = {
        name: 'test',
        when: '#testing',
        handler: () => {},
        children: [],
      };

      const client = <MockedGab>new Gab({
        routes,
        name: 'test',
        credentials: {
          username: 'test',
          password: 'test',
          workspaceId: 'test',
        },
        statusPollRate: 1,
      });

      client.mock('updateWorkspace', (data, cb) => {
        cb(null, {});
      });

      let calls = 0;
      client.mock('getWorkspace', (data, cb) => {
        if (calls++ === 3) {
          return cb(null, { status: 'available' });
        }

        return cb(null, { status: 'training' });
      });

      client.applyChanges().then(() => {
        done();
      }).catch((e) => {
        done();
      });
    });

    it('should handle errors from update workspace', (done) => {
      const routes: IRoutes = {
        name: 'test',
        when: '#testing',
        handler: () => {},
        children: [],
      };

      const client = <MockedGab>new Gab({
        routes,
        name: 'test',
        credentials: {
          username: 'test',
          password: 'test',
          workspaceId: 'test',
        },
      });

      client.mock('updateWorkspace', (data, cb) => {
        cb('updateWorkspace Error', {});
      });

      let calls = 0;
      client.mock('getWorkspace', (data, cb) => {
        if (calls++ === 3) {
          return cb(null, { status: 'available' });
        }

        return cb(null, { status: 'training' });
      });

      client.applyChanges().catch((e) => {
        expect(e).toBe('updateWorkspace Error');
        done();
      });
    });

    it('should handle errors from get workspace', (done) => {
      const routes: IRoutes = {
        name: 'test',
        when: '#testing',
        handler: () => {},
        children: [],
      };

      const client = <MockedGab>new Gab({
        routes,
        name: 'test',
        credentials: {
          username: 'test',
          password: 'test',
          workspaceId: 'test',
        },
      });

      client.mock('updateWorkspace', (data, cb) => {
        cb(null, {});
      });

      client.mock('getWorkspace', (data, cb) => {
        return cb('getWorkspace Error', {});
      });

      client.applyChanges().catch((e) => {
        expect(e).toBe('getWorkspace Error');
        done();
      });
    });

    it('should handle errors from unhandled status', (done) => {
      const routes: IRoutes = {
        name: 'test',
        when: '#testing',
        handler: () => {},
        children: [],
      };

      const client = <MockedGab>new Gab({
        routes,
        name: 'test',
        credentials: {
          username: 'test',
          password: 'test',
          workspaceId: 'test',
        },
      });

      client.mock('updateWorkspace', (data, cb) => {
        cb(null, {});
      });

      let calls = 0;
      client.mock('getWorkspace', (data, cb) => {
        if (calls++ === 3) {
          return cb(null, { status: 'available' });
        }

        return cb(null, { status: 'unhandled' });
      });

      client.applyChanges().catch((e) => {
        expect(e).toBeTruthy();
        done();
      });
    });
  });

  describe('send message', () => {
    it('should send message to watson', () => {
      const routes: IRoutes = {
        name: 'test',
        when: '#testing',
        handler: () => 'template response',
        children: [],
      };

      const client = <MockedGab>new Gab({
        routes,
        name: 'test',
        credentials: {
          username: 'test',
          password: 'test',
          workspaceId: 'test',
        },
      });

      const response = {
        context: {
          conversation_id: '123',
        },
        output: {
          values: [
            { template: 'test' },
          ],
        },
      };

      client.mock('message', (data, cb) => {
        cb(null, response);
      });

      return client.sendMessage('test').then((res) => {
        expect(res).toEqual({
          response,
          conversationId: '123',
          msg: 'template response',
        });
      });
    });

    it('should reject with error if routes have not been supplied', () => {
      const client = <MockedGab>new Gab({
        name: 'test',
        credentials: {
          username: 'test',
          password: 'test',
          workspaceId: 'test',
        },
      });

      return client.sendMessage('test').catch((err) => {
        expect(err).toBeTruthy();
      });
    });

    it('should reject with error if watson returns error', () => {
      const routes: IRoutes = {
        name: 'test',
        when: '#testing',
        handler: () => 'template response',
        children: [],
      };

      const client = <MockedGab>new Gab({
        routes,
        name: 'test',
        credentials: {
          username: 'test',
          password: 'test',
          workspaceId: 'test',
        },
      });

      client.mock('message', (data, cb) => {
        cb('watson error');
      });

      return client.sendMessage('test').catch((err) => {
        expect(err).toBe('watson error');
      });
    });

    it('should reject with error if watson returns unexpected output', () => {
      const routes: IRoutes = {
        name: 'test',
        when: '#testing',
        handler: () => 'template response',
        children: [],
      };

      const client = <MockedGab>new Gab({
        routes,
        name: 'test',
        credentials: {
          username: 'test',
          password: 'test',
          workspaceId: 'test',
        },
      });

      client.mock('message', (data, cb) => {
        cb(null, {
          context: {
            conversation_id: '123',
          },
        });
      });

      return client.sendMessage('test').catch((err) => {
        expect(err.message).toBe('Incorrect output received');
      });
    });

    it('should reject with error if watson response doesn\'t contain a template id', () => {
      const routes: IRoutes = {
        name: 'test',
        when: '#testing',
        handler: () => 'template response',
        children: [],
      };

      const client = <MockedGab>new Gab({
        routes,
        name: 'test',
        credentials: {
          username: 'test',
          password: 'test',
          workspaceId: 'test',
        },
      });

      client.mock('message', (data, cb) => {
        cb(null, {
          context: {
            conversation_id: '123',
          },
          output: {
            values: [
              {},
            ],
          },
        });
      });

      return client.sendMessage('test').catch((err) => {
        expect(err.message).toBe('No template specified');
      });
    });

    it('should reject with error if template handler cannot be found', () => {
      const routes: IRoutes = {
        name: 'test',
        when: '#testing',
        handler: () => 'template response',
        children: [],
      };

      const client = <MockedGab>new Gab({
        routes,
        name: 'test',
        credentials: {
          username: 'test',
          password: 'test',
          workspaceId: 'test',
        },
      });

      client.mock('message', (data, cb) => {
        cb(null, {
          context: {
            conversation_id: '123',
          },
          output: {
            values: [
              { template: 'noexist' },
            ],
          },
        });
      });

      return client.sendMessage('test').catch((err) => {
        expect(err.message).toBe('noexist has not been setup.');
      });
    });
  });
});
