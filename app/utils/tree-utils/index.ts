import { bfs } from 'utils/tree-utils/bfs'
import { TreeFn } from 'utils/tree-utils/types'


export function findNode<NodeType>(
  getChildren: TreeFn<NodeType>,
  predicate: (node: NodeType) => boolean
) {
  const [node] = bfs(getChildren, predicate)
  return node
}
