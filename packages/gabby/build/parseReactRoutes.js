"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getNS(prefix, next) {
    if (prefix) {
        return prefix + "." + next;
    }
    return next;
}
function parseReactRoutes(routes) {
    var tree = {};
    function recurse(node, prevNode, namespace) {
        var nextNodes = [].concat(node.props.children).filter(Boolean);
        var _a = node.props, name = _a.name, when = _a.when, to = _a.to, component = _a.component, ns = _a.namespace;
        return {
            name: name && namespace + "." + name,
            when: when,
            to: to,
            handler: component,
            children: nextNodes.map(function (n) { return recurse(n, node, ns ? getNS(namespace, ns) : namespace); })
        };
    }
    return recurse(routes);
}
exports.default = parseReactRoutes;
