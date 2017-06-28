/*
 * Copyright 2017 American Express
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
 
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
        var namespacedName = namespace + "." + name;
        if (!namespace) {
            namespacedName = name;
        }
        return {
            when: when,
            to: to,
            name: name && namespacedName,
            handler: component,
            children: nextNodes.map(function (n) { return recurse(n, node, ns ? getNS(namespace, ns) : namespace); }),
        };
    }
    return recurse(routes);
}
exports.default = parseReactRoutes;
