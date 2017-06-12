"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseReactRoutes(routes) {
    var namespace = routes.props.namespace;
    var tree = {};
    function recurse(node, prevNode) {
        var nextNodes = [].concat(node.props.children).filter(Boolean);
        var _a = node.props, name = _a.name, when = _a.when, to = _a.to, component = _a.component;
        return {
            name: name && namespace + "." + name,
            when: when,
            to: to,
            handler: component,
            children: nextNodes.map(function (n) { return recurse(n, node); })
        };
    }
    return recurse(routes);
}
exports.default = parseReactRoutes;
