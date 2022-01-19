import { useCallback, memo } from 'react'

import { Checkbox } from '@material-ui/core'
import { mdiChevronRight, mdiChevronDown } from '@mdi/js'
import cn from 'classnames'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { BaseTreeViewNodeProps } from '../../type'

import { useStyles } from './style'

export interface Props<NodeType> extends BaseTreeViewNodeProps<NodeType> {
  node: NodeType
  onToggleExpanded: (node: NodeType) => any
}

export const TreeViewNode = memo(function TreeViewNode<
  NodeType extends any = any
>({ node, onToggleExpanded, onCheckNode, ...props }: Props<NodeType>) {
  const classes = useStyles()
  const childNodes = props.getChildNodes(node) || []

  const expandable = childNodes.length > 0
  const expanded = props.expandedNodes.indexOf(props.getNodeId(node)) > -1

  const handleToggleNode = useCallback(
    () => onToggleExpanded(node),
    [node, onToggleExpanded]
  )

  const handleCheckNode = useCallback(
    () => onCheckNode(node),
    [node, onCheckNode]
  )

  const renderNoder = () => {
    const checkbox = (
      <Checkbox
        size="small"
        classes={{
          root: classes.selectCheckbox
        }}
        onChange={handleCheckNode}
      />
    )
    const arrow = expandable && (
      <button
        type="button"
        className={cn(classes.expandButton, {
          [classes.isExpanded]: expanded
        })}
        onClick={handleToggleNode}
      >
        <SvgIcon
          path={expanded ? mdiChevronDown : mdiChevronRight}
          size={muiIconSizes.small}
        />
      </button>
    )

    return (
      <div
        className={cn(classes.contentContainer, {
          [classes.expandableContentContainer]: expandable,
          [classes.isContentContainerExpanded]: expanded,
          [classes.selectableContentContainer]: props.selectable
        })}
      >
        {arrow}
        {checkbox}
        <div className={classes.content}>{props.renderNode(node)}</div>
      </div>
    )
  }

  return (
    <div className={classes.container}>
      {renderNoder()}
      {expandable && expanded && (
        <div className={classes.childrenContainer}>
          {childNodes.map(node => (
            <TreeViewNode
              key={props.getNodeId(node)}
              node={node}
              onToggleExpanded={onToggleExpanded}
              onCheckNode={handleCheckNode}
              {...props}
            />
          ))}
        </div>
      )}
    </div>
  )
})
