/// <reference types="react" />
import { StatelessComponent } from 'react';
export interface IRouteProps {
    name: string;
    component: Function;
    when?: string;
}
declare const Route: StatelessComponent<IRouteProps>;
export default Route;
