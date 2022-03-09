import { useCallback, useEffect, useState, useMemo, memo } from 'react'

import { Typography } from '@material-ui/core'
import { useControllableState } from 'react-use-controllable-state'

import { TreeViewNode } from './components/TreeViewNode'
import { TreeViewProps } from './type'

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
  const [selectedNodes, setSelectedNodes] = useState<NodeType[]>([])

  const [expandedNodes, setExpandedNodes] = useControllableState(
    props.expandedNodes,
    props.onExpandedNodesChanged,
    props.initialExpandedNodes || []
  )

  const selectedNodeIds: UUID[] = useMemo(
    () => selectedNodes.map(node => getNodeId(node)),
    [selectedNodes, getNodeId]
  )

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

  const onCheckNode = useCallback(
    (node: NodeType) => {
      if (!props.multiSelectable) {
        return
      }

      const nodeId = getNodeId(node)

      setSelectedNodes(nodes =>
        selectedNodeIds.includes(nodeId)
          ? nodes.filter(someNode => getNodeId(someNode) !== nodeId)
          : [...nodes, node]
      )
    },
    [getNodeId, props.multiSelectable, selectedNodeIds]
  )

  useEffect(() => {
    if (!props.initialExpandedNodes) {
      return
    }

    setExpandedNodes(expandedNodes => {
      const newExpandedNodes = props.initialExpandedNodes || []

      if (newExpandedNodes.length === 0) {
        return []
      }

      return [...expandedNodes, ...newExpandedNodes]
    })
  }, [props.initialExpandedNodes, setExpandedNodes])

  const root = getChildNodes()

  if (root.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary">
        There is nothing to show!
      </Typography>
    )
  }

  return (
    <div>
      {(root ?? []).map(node => (
        <TreeViewNode
          node={node}
          key={getNodeId(node)}
          selectable={props.selectable}
          multiSelectable={props.multiSelectable}
          shouldExpandOnNodeClick={props.shouldExpandOnNodeClick}
          expandedNodes={expandedNodes}
          onToggleExpanded={onToggleExpanded}
          getNodeId={getNodeId}
          onCheckNode={onCheckNode}
          getChildNodes={getChildNodes}
          renderNode={props.renderNode}
        />
      ))}
    </div>
  )
})
