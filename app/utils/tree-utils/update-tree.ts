/**
 * Given a tree, a node and an updated node, returns the updated tree (without
 * mutating the original tree)
 */
import { bfs } from 'utils/tree-utils/bfs'

interface Tree {
  children?: Tree[]
}

export function updateTree<T extends Tree>(tree: T, predicate, updater): T {
  const [searchNode, ...path] = bfs<Tree>((parent) => parent ? parent.children || [] : [tree], (node, parents) =>{
    return node === (predicate(node) ? node : undefined)
  })
  return searchNode ? getUpdatedTree([...[...path].reverse(), searchNode], updater(searchNode)) : tree
}


function getUpdatedTree(path: Tree[], newChild: Tree) {
  const [parent, ...rest] = path
  if(rest.length === 0) {
    return newChild
  }
  return {...parent, children: parent.children!.map(
    aChild => aChild === rest[0] ? getUpdatedTree(rest, newChild) : aChild)}
}

