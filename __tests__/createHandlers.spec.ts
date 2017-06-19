import { IRoutes } from '../src/interfaces';
import createHandlers from '../src/createHandlers';

describe('Create handlers', () => {
  it('should return a map of handlers for routes', () => {
    const selectPlanHandler = () => {};
    const acceptTermsHandler = () => {};

    const routes: IRoutes = {
      name: 'select plan',
      when: '#select_plan',
      handler: selectPlanHandler,
      children: [
        {
          name: 'accept terms',
          when: '#accept_terms',
          handler: acceptTermsHandler,
          children: [],
        },
      ],
    };

    expect(createHandlers(routes)).toEqual(new Map([
      ['select plan', selectPlanHandler],
      ['accept terms', acceptTermsHandler],
    ]));
  });

  it('should not return undefined handlers', () => {
    const routes: IRoutes = {
      name: 'select plan',
      when: '#select_plan',
      handler: undefined,
      children: [],
    };

    expect(createHandlers(routes)).toEqual(new Map());
  });
});
