import { ReactNode } from 'react'

import { TreeFn } from 'utils/tree-utils/types'

export interface BaseTreeViewProps<NodeType> {
  renderNode: (node: NodeType) => ReactNode
  selectable?: boolean
  getNodeId: (node: NodeType) => string
  getChildNodes: TreeFn<NodeType>
  expandedNodes: string[]
}
