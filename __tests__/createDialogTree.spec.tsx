import * as React from 'react';

import parseReactRoutes from '../src/parseReactRoutes';
import Root from '../src/components/Root';
import Route from '../src/components/Route';
import Redirect from '../src/components/Redirect';

import createDialogTree from '../src/createDialogTree';

const Hello = () => `Hello`;
const SelectPlan = () => `Some help`;
const TermsAccepted = () => `Some terms`;
const Goodbye = () => `Goodbye`;
const Help = () => `Some help`;

const routes = (
  <Root namespace="mocked">
    <Route name="Select Plan" when="#select_plan" component={SelectPlan}>
      <Route name="Accept Terms" when="#accept" component={TermsAccepted} />
      <Redirect name="Decline Terms" when="#decline" to="mocked.Goodbye" />
    </Route>
    <Route name="Goodbye" component={Goodbye} />
    <Route name="Help" when="#help" component={Help} />
  </Root>
);

const nestedNamespacesRoutes = (
  <Root namespace="mocked">
    <Route name="Hello" when="#greeting" component={Hello} />
    <Root namespace="mockedAgain">
      <Route name="Select Plan" when="#select_plan" component={SelectPlan}>
        <Route name="Accept Terms" when="#accept" component={TermsAccepted} />
        <Redirect name="Decline Terms" when="#decline" to="mocked.mockedAgain.Goodbye" />
      </Route>
      <Route name="Goodbye" component={Goodbye} />
      <Route name="Help" when="#help" component={Help} />
    </Root>
  </Root>
);

describe('Create dialog tree', () => {
  it('should create correct dialog array', () => {
    const nodes = parseReactRoutes(routes);

    expect(createDialogTree(nodes)).toEqual([
      {
        dialog_node: 'mocked.Select Plan',
        conditions: '#select_plan',
        go_to: null,
        output: {
          values: [
            {
              template: 'mocked.Select Plan',
            },
          ],
          selection_policy: 'sequential',
        },
        parent: null,
        previous_sibling: null,
      },
      {
        dialog_node: 'mocked.Accept Terms',
        conditions: '#accept',
        go_to: null,
        output: {
          values: [
            {
              template: 'mocked.Accept Terms',
            },
          ],
          selection_policy: 'sequential',
        },
        parent: 'mocked.Select Plan',
        previous_sibling: null,
      },
      {
        dialog_node: 'mocked.Decline Terms',
        conditions: '#decline',
        go_to: {
          return: null,
          dialog_node: 'mocked.Goodbye',
          selector: 'body',
        },
        output: {},
        parent: 'mocked.Select Plan',
        previous_sibling: 'mocked.Accept Terms',
      },
      {
        dialog_node: 'mocked.Goodbye',
        conditions: null,
        go_to: null,
        output: {
          values: [
            {
              template: 'mocked.Goodbye',
            },
          ],
          selection_policy: 'sequential',
        },
        parent: null,
        previous_sibling: 'mocked.Select Plan'
      },
      {
        dialog_node: 'mocked.Help',
        conditions: '#help',
        go_to: null,
        output: {
          values: [
            {
              template: 'mocked.Help',
            },
          ],
          selection_policy: 'sequential',
        },
        parent: null,
        previous_sibling: 'mocked.Goodbye',
      }
    ]);
  });

  it('should create correct dialog array when namespaces are nested', () => {
    const nodes = parseReactRoutes(nestedNamespacesRoutes);

    expect(createDialogTree(nodes)).toEqual([
      {
        dialog_node: 'mocked.Hello',
        conditions: '#greeting',
        go_to: null,
        output: {
          values: [
            {
              template: 'mocked.Hello',
            },
          ],
          selection_policy: 'sequential',
        },
        parent: null,
        previous_sibling: null,
      },
      {
        dialog_node: 'mocked.mockedAgain.Select Plan',
        conditions: '#select_plan',
        go_to: null,
        output: {
          values: [
            {
              template: 'mocked.mockedAgain.Select Plan',
            },
          ],
          selection_policy: 'sequential',
        },
        parent: null,
        previous_sibling: 'mocked.Hello',
      },
      {
        dialog_node: 'mocked.mockedAgain.Accept Terms',
        conditions: '#accept',
        go_to: null,
        output: {
          values: [
            {
              template: 'mocked.mockedAgain.Accept Terms',
            },
          ],
          selection_policy: 'sequential',
        },
        parent: 'mocked.mockedAgain.Select Plan',
        previous_sibling: null,
      },
      {
        dialog_node: 'mocked.mockedAgain.Decline Terms',
        conditions: '#decline',
        go_to: {
          return: null,
          dialog_node: 'mocked.mockedAgain.Goodbye',
          selector: 'body',
        },
        output: {},
        parent: 'mocked.mockedAgain.Select Plan',
        previous_sibling: 'mocked.mockedAgain.Accept Terms',
      },
      {
        dialog_node: 'mocked.mockedAgain.Goodbye',
        conditions: null,
        go_to: null,
        output: {
          values: [
            {
              template: 'mocked.mockedAgain.Goodbye',
            },
          ],
          selection_policy: 'sequential',
        },
        parent: null,
        previous_sibling: 'mocked.mockedAgain.Select Plan'
      },
      {
        dialog_node: 'mocked.mockedAgain.Help',
        conditions: '#help',
        go_to: null,
        output: {
          values: [
            {
              template: 'mocked.mockedAgain.Help',
            },
          ],
          selection_policy: 'sequential',
        },
        parent: null,
        previous_sibling: 'mocked.mockedAgain.Goodbye',
      }
    ]);
  });
});
