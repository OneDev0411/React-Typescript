import { useCallback, memo } from 'react'

import { mdiChevronRight, mdiChevronDown } from '@mdi/js'
import cn from 'classnames'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { BaseTreeViewProps } from '../../type'

import { useStyles } from './style'

export interface Props<NodeType> extends BaseTreeViewProps<NodeType> {
  node: NodeType
  onToggleExpanded: (node: NodeType) => any
}

export const TreeViewNode = memo(function TreeViewNode<
  NodeType extends any = any
>({ node, onToggleExpanded, ...props }: Props<NodeType>) {
  const classes = useStyles()
  const childNodes = props.getChildNodes(node) || []

  const expanded = props.expandedNodes.indexOf(props.getNodeId(node)) > -1

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
          [classes.expandableContentContainer]: expandable,
          [classes.selectableContentContainer]: props.selectable
        })}
      >
        {arrow} <div className={classes.content}>{props.renderNode(node)}</div>
      </div>
      {expanded && (
        <div className={classes.childrenContainer}>
          {childNodes.map(node => (
            <TreeViewNode
              key={props.getNodeId(node)}
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
