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
 
import * as React from 'react';

import parseReactRoutes from '../../src/utils/parseReactRoutes';
import Root from '../../src/components/Root';
import Route from '../../src/components/Route';
import Redirect from '../../src/components/Redirect';

const SelectPlan = () => `Some help`;
const TermsAccepted = () => `Some terms`;
const Goodbye = () => `Goodbye`;
const Help = () => `Some help`;

describe('Parse Routes', () => {
  it('should return correct object structure', () => {
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

    expect(parseReactRoutes(routes)).toEqual({
      children: [
        {
          name: 'mocked.Select Plan',
          when: '#select_plan',
          to: undefined,
          handler: SelectPlan,
          children: [
            {
              name: 'mocked.Accept Terms',
              when: '#accept',
              to: undefined,
              handler: TermsAccepted,
              children: [],
            },
            {
              name: 'mocked.Decline Terms',
              when: '#decline',
              to: 'mocked.Goodbye',
              handler: undefined,
              children: [],
            },
          ],
        },
        {
          name: 'mocked.Goodbye',
          when: undefined,
          to: undefined,
          handler: Goodbye,
          children: [],
        },
        {
          name: 'mocked.Help',
          when: '#help',
          to: undefined,
          handler: Help,
          children: [],
        },
      ]
    });
  });

  it('should return correct object structure when no namespace is provided', () => {
    const routes = (
      <Root>
        <Route name="Select Plan" when="#select_plan" component={SelectPlan}>
          <Route name="Accept Terms" when="#accept" component={TermsAccepted} />
          <Redirect name="Decline Terms" when="#decline" to="Goodbye" />
        </Route>
        <Route name="Goodbye" component={Goodbye} />
        <Route name="Help" when="#help" component={Help} />
      </Root>
    );

    expect(parseReactRoutes(routes)).toEqual({
      children: [
        {
          name: 'Select Plan',
          when: '#select_plan',
          to: undefined,
          handler: SelectPlan,
          children: [
            {
              name: 'Accept Terms',
              when: '#accept',
              to: undefined,
              handler: TermsAccepted,
              children: [],
            },
            {
              name: 'Decline Terms',
              when: '#decline',
              to: 'Goodbye',
              handler: undefined,
              children: [],
            },
          ],
        },
        {
          name: 'Goodbye',
          when: undefined,
          to: undefined,
          handler: Goodbye,
          children: [],
        },
        {
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
