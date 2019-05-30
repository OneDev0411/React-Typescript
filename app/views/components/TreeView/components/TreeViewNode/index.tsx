import * as React from 'react'
import { ReactNode, useCallback } from 'react'
import { FlexItem } from 'styled-flex-component'

import {
  TreeViewExpandArrow,
  TreeViewExpandButton,
  TreeViewNodeChildrenContainer,
  TreeViewNodeContainer
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

export const TreeViewNode = React.memo(
  <NodeType extends any = any>({
    node,
    onToggleExpanded,
    ...props
  }: Props<NodeType>) => {
    const childNodes = props.getChildNodes(node) || []

    const expanded = props.expandedNodes.indexOf(props.getId(node)) > -1

    const toggle = useCallback(() => onToggleExpanded(node), [
      node,
      onToggleExpanded
    ])

    const arrow =
      childNodes.length > 0 ? (
        <TreeViewExpandButton onClick={toggle}>
          <TreeViewExpandArrow expanded={expanded} />
        </TreeViewExpandButton>
      ) : null

    return (
      <>
        <TreeViewNodeContainer selectable={props.selectable}>
          {arrow} <FlexItem grow={1} style={{maxWidth: '100%'}}>{props.renderNode(node)}</FlexItem>
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
  }
)
