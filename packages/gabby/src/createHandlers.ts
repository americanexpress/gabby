import { IRoutes, IRouteNode, IHandlers } from './interfaces';

export default function createHandlers(routes: IRoutes) {
  const tree: IHandlers = new Map();

  function recurse(node: IRouteNode) {
    const { name, children, handler } = node;
    if (handler) {
      tree.set(name, handler);
    }

    children.forEach(child => recurse(child));
  }

  if (routes) {
    recurse(routes);
  }

  return tree;
}
