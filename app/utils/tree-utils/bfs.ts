import { TreeFn } from 'utils/tree-utils/types'

type Visitor<NodeType> = (node: NodeType, parents: NodeType[]) => boolean

export function bfs<NodeType>(getChildren: TreeFn<NodeType>, visit: Visitor<NodeType>, parents?: NodeType[]) {
  const children = getChildren(parents ? parents[0] : undefined) || []

  let node = children.find(child => visit(child, parents || []))

  if (!node) {
    let childPath;
    children.some(child => {
      childPath = bfs(getChildren, visit, [child, ...(parents || [] as NodeType[])])
      return childPath.length > 0;
    })

    return childPath || []
  }

  return [node, ...(parents || [])]
}
