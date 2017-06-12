import { IRoutes, IRouteNode, IHandlers } from './interfaces';

export default function createHandlers(routes: IRoutes) {
  const tree: IHandlers = new Map();

  function recurse(node: IRouteNode) {
    const { id, children, handler } = node;
    if (handler) {
      tree.set(id, handler);
    }

    children.forEach(child => recurse(child));
  }

  recurse(routes);
  return tree;
}