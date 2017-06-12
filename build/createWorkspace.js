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
function createDialogTree(routes) {
    var tree = [];
    function dig(node, prevNode, prevSibling) {
        var nextNodes = [].concat(node.children).filter(Boolean);
        if (node.name !== 'root') {
            var name_1 = node.name, to = node.to, when = node.when;
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
                parent: prevNode ? prevNode.name : null,
                previous_sibling: prevSibling ? prevSibling.name : null,
            });
        }
        nextNodes.forEach(function (n, index, arr) { return dig(n, node, arr[index - 1]); });
    }
    dig(routes);
    return tree;
}
exports.createDialogTree = createDialogTree;
