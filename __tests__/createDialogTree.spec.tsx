import * as React from 'react';

import parseReactRoutes from '../src/parseReactRoutes';
import Root from '../src/components/Root';
import Route from '../src/components/Route';
import Redirect from '../src/components/Redirect';

import createDialogTree from '../src/createDialogTree';

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

describe('Create dialog tree', () => {
  it('should create correct dialog array', () => {
    const nodes = parseReactRoutes(routes);

    expect(createDialogTree(nodes)).toEqual([
      {
        dialog_node: 'Select Plan',
        conditions: '#select_plan',
        go_to: null,
        output: {
          values: [
            {
              template: 'Select Plan(mocked)',
            },
          ],
          selection_policy: 'sequential',
        },
        parent: null,
        previous_sibling: null,
      },
      {
        dialog_node: 'Accept Terms',
        conditions: '#accept',
        go_to: null,
        output: {
          values: [
            {
              template: 'Accept Terms(mocked)',
            },
          ],
          selection_policy: 'sequential',
        },
        parent: 'Select Plan',
        previous_sibling: null,
      },
      {
        dialog_node: 'Decline Terms',
        conditions: '#decline',
        go_to: {
          return: null,
          dialog_node: 'Goodbye',
          selector: 'body',
        },
        output: {},
        parent: 'Select Plan',
        previous_sibling: 'Accept Terms',
      },
      {
        dialog_node: 'Goodbye',
        conditions: null,
        go_to: null,
        output: {
          values: [
            {
              template: 'Goodbye(mocked)',
            },
          ],
          selection_policy: 'sequential',
        },
        parent: null,
        previous_sibling: 'Select Plan'
      },
      {
        dialog_node: 'Help',
        conditions: '#help',
        go_to: null,
        output: {
          values: [
            {
              template: 'Help(mocked)',
            },
          ],
          selection_policy: 'sequential',
        },
        parent: null,
        previous_sibling: 'Goodbye',
      }
    ]);
  });
});
