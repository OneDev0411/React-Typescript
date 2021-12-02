import { ReactNode, useCallback, memo } from 'react'

import { mdiChevronRight, mdiChevronDown } from '@mdi/js'
import cn from 'classnames'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useStyles } from './style'

export interface Props<NodeType> {
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

export const TreeViewNode = memo(function TreeViewNode<
  NodeType extends any = any
>({ node, onToggleExpanded, ...props }: Props<NodeType>) {
  const classes = useStyles()
  const childNodes = props.getChildNodes(node) || []

  const expanded = props.expandedNodes.indexOf(props.getId(node)) > -1

  const toggle = useCallback(
    () => onToggleExpanded(node),
    [node, onToggleExpanded]
  )

  const expandable = childNodes.length > 0
  const arrow = expandable && (
    <button
      type="button"
      className={cn(classes.expandButton, {
        [classes.isExpanded]: expanded
      })}
      onClick={toggle}
    >
      <SvgIcon
        path={expanded ? mdiChevronDown : mdiChevronRight}
        size={muiIconSizes.small}
      />
    </button>
  )

  return (
    <div className={classes.container}>
      <div
        className={cn(classes.contentContainer, {
          [classes.selectableContentContainer]: props.selectable
        })}
      >
        {arrow} <div className={classes.content}>{props.renderNode(node)}</div>
      </div>
      {expanded && (
        <div className={classes.childrenContainer}>
          {childNodes.map(node => (
            <TreeViewNode
              key={props.getId(node)}
              node={node}
              onToggleExpanded={onToggleExpanded}
              {...props}
            />
          ))}
        </div>
      )}
    </div>
  )
})
