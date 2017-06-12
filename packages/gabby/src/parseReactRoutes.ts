import { IRoutes } from './interfaces';

export default function parseReactRoutes(routes): IRoutes {
  const { namespace } = routes.props;
  const tree = {};

  function recurse(node, prevNode?) {
    let nextNodes = [].concat(node.props.children).filter(Boolean);

    const { name, when, to, component } = node.props;

    return {
      name: name && `${namespace}.${name}`,
      when,
      to,
      handler: component,
      children: nextNodes.map(n => recurse(n, node))
    };
  }

  return recurse(routes);
}
