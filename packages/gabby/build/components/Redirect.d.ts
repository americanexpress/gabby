import { StatelessComponent } from 'react';
export interface IRedirectProps {
    name: string;
    when: string;
    to: string;
}
declare const Redirect: StatelessComponent<IRedirectProps>;
export default Redirect;
