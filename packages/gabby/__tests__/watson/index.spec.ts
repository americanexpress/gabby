import Gab from '../../src/watson/index';
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
      name: 'test',
      credentials: {
        username: 'test',
        password: 'test',
        workspaceId: 'test',
      },
      intents,
      entities,
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
        name: 'test',
        credentials: {
          username: 'test',
          password: 'test',
          workspaceId: 'test',
        },
        routes,
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
        name: 'test',
        credentials: {
          username: 'test',
          password: 'test',
          workspaceId: 'test',
        },
        routes,
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
        name: 'test',
        credentials: {
          username: 'test',
          password: 'test',
          workspaceId: 'test',
        },
        routes,
      });

      client.mock('updateWorkspace', (data, cb) => {
        cb(null, {});
      });

      let calls = 0;
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
        name: 'test',
        credentials: {
          username: 'test',
          password: 'test',
          workspaceId: 'test',
        },
        routes,
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
});
