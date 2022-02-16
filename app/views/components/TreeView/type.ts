import { ReactNode } from 'react'

import { TreeFn } from 'utils/tree-utils/types'

export interface BaseTreeViewNodeProps<NodeType> {
  renderNode: (node: NodeType) => ReactNode
  selectable?: boolean
  multiSelectable?: boolean
  shouldExpandOnNodeClick?: boolean
  isChildNode?: boolean
  getNodeId: (node: NodeType) => string
  onCheckNode?: (node: NodeType) => void
  getChildNodes: TreeFn<NodeType>
  expandedNodes: string[]
}

export interface TreeViewProps<NodeType>
  extends OptionalBy<
    Omit<BaseTreeViewNodeProps<NodeType>, 'onCheckNode' | 'isChildNode'>,
    'getNodeId' | 'getChildNodes' | 'expandedNodes'
  > {
  onExpandedNodesChanged?: (nodes: string[]) => void
  initialExpandedNodes?: string[]
}
