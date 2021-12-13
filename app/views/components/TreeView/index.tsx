import { useCallback, useEffect, memo } from 'react'

import { Typography, makeStyles, Theme } from '@material-ui/core'
import { useControllableState } from 'react-use-controllable-state'

import { TreeViewNode } from './components/TreeViewNode'
import { BaseTreeViewProps } from './type'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {}
  }),
  { name: 'TreeView' }
)

export interface TreeViewProps<NodeType>
  extends OptionalBy<
    BaseTreeViewProps<NodeType>,
    'getNodeId' | 'getChildNodes' | 'expandedNodes'
  > {
  onExpandedNodesChanged?: (nodes: string[]) => void
  initialExpandedNodes?: string[]
}

/**
 * Rechat treeview component with support for:
 * - selected nodes (Not implemented yet)
 * - expanded and collapse nodes
 *
 *
 * NOTE: We intentionally didn't took the approach of having the whole tree
 * and UI state into an input like this:
 * {expanded: boolean, selected: boolean, data: any, ...}
 * We instead keep expandedNodes and selectedNodes and stuff like this in
 * separate props with optional control from outside.
 *
 * Why not the first approach:
 * - It mixes the the actual data behind the tree and the tree UI state.
 * - It's harder to maintain immutable tree structure, than arrays.
 * - No need for converting tree structure of the data into compatible type
 *   for this component. No data type enforcement.
 * @param getNodeId
 * @param getChildNodes
 * @param props
 * @constructor
 */
export default memo(function TreeView<NodeType = any>({
  getNodeId = (node => node.id) as any,
  getChildNodes = (node => node.children) as any,
  ...props
}: TreeViewProps<NodeType>) {
  const classes = useStyles()
  const [expandedNodes, setExpandedNodes] = useControllableState(
    props.expandedNodes,
    props.onExpandedNodesChanged,
    props.initialExpandedNodes || []
  )

  useEffect(() => {
    if (props.initialExpandedNodes) {
      setExpandedNodes(expandedNodes => {
        return [...expandedNodes, ...(props.initialExpandedNodes || [])]
      })
    }
  }, [props.initialExpandedNodes, setExpandedNodes])

  const toggleNode = useCallback(
    node => {
      setExpandedNodes(expandedNodes =>
        expandedNodes.includes(getNodeId(node))
          ? expandedNodes.filter(someNode => someNode !== getNodeId(node))
          : [...expandedNodes, getNodeId(node)]
      )
    },
    [getNodeId, setExpandedNodes]
  )

  const onToggleExpanded = useCallback(node => toggleNode(node), [toggleNode])

  const root = getChildNodes()

  if (root.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary">
        There is nothing to show!
      </Typography>
    )
  }

  return (
    <div className={classes.container}>
      {(root ?? []).map(node => (
        <TreeViewNode
          node={node}
          key={getNodeId(node)}
          expandedNodes={expandedNodes}
          onToggleExpanded={onToggleExpanded}
          getNodeId={getNodeId}
          getChildNodes={getChildNodes}
          selectable={props.selectable}
          renderNode={props.renderNode}
        />
      ))}
    </div>
  )
})
