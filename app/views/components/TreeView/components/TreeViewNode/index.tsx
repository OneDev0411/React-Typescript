import * as React from 'react'
import { ReactNode, useCallback } from 'react'

import {
  TreeViewExpandArrow,
  TreeViewExpandButton,
  TreeViewNodeChildrenContainer,
  TreeViewNodeContainer,
  TreeViewNodeContent
} from './styled'

interface Props<NodeType> {
  node: NodeType

  // adapter
  renderNode: (node: NodeType) => ReactNode
  getId: (node: NodeType) => string
  getChildNodes: (node?: NodeType) => NodeType[]
  //

  expandedNodes: string[]
  selectedNode?: string
  selectable?: boolean
  onToggleExpanded: (node: NodeType) => any
}

export const TreeViewNode = React.memo(function TreeViewNode<
  NodeType extends any = any
>({ node, onToggleExpanded, ...props }: Props<NodeType>) {
  const childNodes = props.getChildNodes(node) || []

  const expanded = props.expandedNodes.indexOf(props.getId(node)) > -1

  const toggle = useCallback(() => onToggleExpanded(node), [
    node,
    onToggleExpanded
  ])

  const expandable = childNodes.length > 0
  const arrow = expandable ? (
    <TreeViewExpandButton onClick={toggle}>
      <TreeViewExpandArrow expanded={expanded} />
    </TreeViewExpandButton>
  ) : null

  return (
    <>
      <TreeViewNodeContainer
        selectable={props.selectable}
        expandable={expandable}
      >
        {arrow}{' '}
        <TreeViewNodeContent>{props.renderNode(node)}</TreeViewNodeContent>
      </TreeViewNodeContainer>
      {expanded && (
        <TreeViewNodeChildrenContainer>
          {childNodes.map(node => (
            <TreeViewNode
              key={props.getId(node)}
              node={node}
              onToggleExpanded={onToggleExpanded}
              {...props}
            />
          ))}
        </TreeViewNodeChildrenContainer>
      )}
    </>
  )
})
