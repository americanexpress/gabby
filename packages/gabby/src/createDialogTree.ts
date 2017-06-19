export default function createDialogTree(routes) {
  const tree = [];
  let lastNodeName = null;

  function recurse(node, prevNode?, prevSibling?) {
    const nextNodes = [].concat(node.children).filter(Boolean);

    if (!node.name) {
      lastNodeName = (prevSibling && prevSibling.name) || null;
    }

    if (node.name) {
      const { name, to, when } = node;
      tree.push({
        dialog_node: name,
        go_to: to ? {
          return: null,
          dialog_node: to,
          selector: 'body',
        } : null,
        // no output if we're redirecting
        output: to ? {} : {
          values: [
            { template: name },
          ],
          // TODO: Make this configurable
          selection_policy: 'sequential',
        },
        conditions: when || null,
        parent: (prevNode && prevNode.name) ? prevNode.name : null,
        previous_sibling: (prevSibling && prevSibling.name) || lastNodeName,
      });

      lastNodeName = null;
    }

    nextNodes.forEach((n, index, arr) => {
      recurse(n, node, arr[index - 1]);
    });
  }

  recurse(routes);

  return tree;
}
