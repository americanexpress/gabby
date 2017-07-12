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
 
import { IRoutes } from 'gabby-types';
import createHandlers from '../../src/utils/createHandlers';

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
