import { useCallback, memo, MouseEvent, ChangeEvent } from 'react'

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
>({
  node,
  isChildNode = false,
  onToggleExpanded,
  onCheckNode,
  ...props
}: Props<NodeType>) {
  const classes = useStyles()
  const childNodes = props.getChildNodes(node) || []

  const expandable = childNodes.length > 0
  const expanded = props.expandedNodes.indexOf(props.getNodeId(node)) > -1

  const handleToggleNode = useCallback(
    () => onToggleExpanded(node),
    [node, onToggleExpanded]
  )

  const handleCheckNode = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()

    if (!props.multiSelectable || !onCheckNode) {
      return
    }

    onCheckNode(node)
  }

  const handleOnNodeClick = () => {
    if (!expandable || !props.shouldExpandOnNodeClick) {
      return
    }

    handleToggleNode()
  }

  const handleOnExpandButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()

    handleToggleNode()
  }

  const renderNode = () => {
    const checkbox = props.multiSelectable && (
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
        className={cn(classes.expandNodeButton, {
          [classes.isExpanded]: expanded
        })}
        onClick={handleOnExpandButtonClick}
      >
        <SvgIcon
          path={expanded ? mdiChevronDown : mdiChevronRight}
          size={muiIconSizes.small}
        />
      </button>
    )

    const otherNodeContentClassNames = {
      [classes.expandableNode]: expandable,
      [classes.rootNoneExpandableNode]: !isChildNode && !expandable,
      [classes.childNode]: isChildNode && !expandable,
      [classes.isExpandableOnNodeClick]:
        expandable && props.shouldExpandOnNodeClick,
      [classes.isNodeNotExpanded]: expandable && !expanded,
      [classes.isNodeSelectable]: props.selectable
    }

    return (
      <div
        className={cn(classes.node, otherNodeContentClassNames)}
        onClick={handleOnNodeClick}
      >
        {arrow}
        {checkbox}
        <div className={classes.content}>{props.renderNode(node)}</div>
      </div>
    )
  }

  return (
    <div className={classes.nodeContainer}>
      {renderNode()}
      {expandable && expanded && (
        <div className={classes.childrenContainer}>
          {childNodes.map(node => (
            <TreeViewNode
              key={props.getNodeId(node)}
              isChildNode
              node={node}
              onToggleExpanded={onToggleExpanded}
              onCheckNode={onCheckNode}
              {...props}
            />
          ))}
        </div>
      )}
    </div>
  )
})
