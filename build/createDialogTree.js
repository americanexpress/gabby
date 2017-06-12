"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createDialogTree(routes) {
    var tree = [];
    function recurse(node, prevNode, prevSibling) {
        var nextNodes = [].concat(node.children).filter(Boolean);
        if (node.name) {
            var name_1 = node.name, to = node.to, when = node.when;
            tree.push({
                dialog_node: name_1,
                go_to: to ? {
                    return: null,
                    dialog_node: to,
                    selector: 'body',
                } : null,
                // no output if we're redirecting
                output: to ? {} : {
                    values: [
                        { template: name_1 }
                    ],
                    // TODO: Make this configurable
                    selection_policy: 'sequential'
                },
                conditions: when || null,
                parent: (prevNode && prevNode.name) ? prevNode.name : null,
                previous_sibling: prevSibling ? prevSibling.name : null,
            });
        }
        nextNodes.forEach(function (n, index, arr) { return recurse(n, node, arr[index - 1]); });
    }
    recurse(routes);
    return tree;
}
exports.default = createDialogTree;
