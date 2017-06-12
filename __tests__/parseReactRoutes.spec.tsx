import * as React from 'react';

import parseReactRoutes from '../src/parseReactRoutes';
import Root from '../src/components/Root';
import Route from '../src/components/Route';
import Redirect from '../src/components/Redirect';

const SelectPlan = () => `Some help`;
const TermsAccepted = () => `Some terms`;
const Goodbye = () => `Goodbye`;
const Help = () => `Some help`;

const routes = (
  <Root namespace="mocked">
    <Route name="Select Plan" when="#select_plan" component={SelectPlan}>
      <Route name="Accept Terms" when="#accept" component={TermsAccepted} />
      <Redirect name="Decline Terms" when="#decline" to="Goodbye" />
    </Route>
    <Route name="Goodbye" component={Goodbye} />
    <Route name="Help" when="#help" component={Help} />
  </Root>
);

describe('Parse Routes', () => {
  it('should return correct object structure', () => {
    expect(parseReactRoutes(routes)).toEqual({
      id: 'root(mocked)',
      name: 'root',
      children: [
        {
          id: 'Select Plan(mocked)',
          name: 'Select Plan',
          when: '#select_plan',
          to: undefined,
          handler: SelectPlan,
          children: [
            {
              id: 'Accept Terms(mocked)',
              name: 'Accept Terms',
              when: '#accept',
              to: undefined,
              handler: TermsAccepted,
              children: [],
            },
            {
              id: 'Decline Terms(mocked)',
              name: 'Decline Terms',
              when: '#decline',
              to: 'Goodbye',
              handler: undefined,
              children: [],
            },
          ],
        },
        {
          id: 'Goodbye(mocked)',
          name: 'Goodbye',
          when: undefined,
          to: undefined,
          handler: Goodbye,
          children: [],
        },
        {
          id: 'Help(mocked)',
          name: 'Help',
          when: '#help',
          to: undefined,
          handler: Help,
          children: [],
        },
      ]
    });
  });
});
