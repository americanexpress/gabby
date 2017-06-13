import { StatelessComponent } from 'react';
import * as PropTypes from 'prop-types';

export interface IRedirectProps {
  name: string;
  when: string;
  to: string;
}

const Redirect: StatelessComponent<IRedirectProps> = () => null;

export default Redirect;

