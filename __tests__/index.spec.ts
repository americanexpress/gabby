import Gab from '../src/Gab';
import parseReactRoutes from '../src/parseReactRoutes';
import Root from '../src/components/Root';
import Route from '../src/components/Route';
import Redirect from '../src/components/Redirect';

import * as index from '../src';

describe('Index', () => {
  it('should export Watson and parseReactRoutes', () => {
    expect(index).toEqual({
      parseReactRoutes,
      Root,
      Route,
      Redirect,
      default: Gab,
    });
  });
});