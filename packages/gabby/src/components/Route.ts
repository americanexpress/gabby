import { StatelessComponent } from 'react';
import * as PropTypes from 'prop-types';

interface IRouteProps {
  name: string;
  component: Function;
  when?: string;
}

const Route: StatelessComponent<IRouteProps> = () => null;

export default Route;
