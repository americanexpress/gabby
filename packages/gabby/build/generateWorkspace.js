"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
    {
      "go_to": null,
      "output": {},
      "parent": "Testing",
      "context": null,
      "created": "2017-06-04T18:33:42.140Z",
      "updated": "2017-06-04T18:34:38.301Z",
      "metadata": null,
      "conditions": null,
      "description": null,
      "dialog_node": "test",
      "previous_sibling": null
    },
*/
function parseRoutes(routes) {
    var tree = [];
    function dig(node, prevNode, prevSibling) {
        var nextNodes = [].concat(node.props.children).filter(Boolean);
        if (prevNode) {
            var _a = node.props, name_1 = _a.name, to = _a.to, when = _a.when;
            tree.push({
                dialog_node: name_1,
                go_to: to || null,
                // no output if we're redirecting
                output: to ? {} : {
                    values: [
                        { template: name_1 }
                    ],
                    selection_policy: 'sequential'
                },
                parent: prevNode ? prevNode.props.name : null,
                previous_sibling: prevSibling ? prevSibling.props.name : null,
            });
        }
        nextNodes.forEach(function (n, index, arr) { return dig(n, node, arr[index - 1]); });
    }
    dig(routes);
    return tree;
}
exports.default = parseRoutes;
