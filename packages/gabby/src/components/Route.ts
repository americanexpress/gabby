import { StatelessComponent } from 'react';
import * as PropTypes from 'prop-types';

export interface IRouteProps {
  name: string;
  component: Function;
  when?: string;
}

const Route: StatelessComponent<IRouteProps> = () => null;

export default Route;
