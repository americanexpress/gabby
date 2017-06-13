import { IRoutes } from './interfaces';

function getNS(prefix, next) {
  if (prefix) {
    return `${prefix}.${next}`;
  }

  return next;
}

export default function parseReactRoutes(routes): IRoutes {
  const tree = {};

  function recurse(node, prevNode?, namespace?) {
    let nextNodes = [].concat(node.props.children).filter(Boolean);
    const { name, when, to, component, namespace: ns } = node.props;

    return {
      name: name && `${namespace}.${name}`,
      when,
      to,
      handler: component,
      children: nextNodes.map(n => recurse(n, node, ns ? getNS(namespace, ns) : namespace))
    };
  }

  return recurse(routes);
}
