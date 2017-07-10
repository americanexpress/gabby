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
