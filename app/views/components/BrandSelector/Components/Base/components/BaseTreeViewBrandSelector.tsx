import { useState, ReactNode } from 'react'

import {
  Typography,
  CircularProgress,
  Theme,
  makeStyles
} from '@material-ui/core'
import useDebouncedCallback from 'use-debounce/lib/callback'

import { useTeamsFilterHook } from '@app/components/Pages/Dashboard/Teams/hooks/use-teams-filter.hook'
import Search from '@app/views/components/Grid/Search'
import TreeView from '@app/views/components/TreeView'
import { noop } from 'utils/helpers'
import { TreeFn } from 'utils/tree-utils/types'

const getNodeId = (team: IBrand) => team.id

const useStyles = makeStyles(
  (theme: Theme) => ({
    searchContainer: {
      marginBottom: theme.spacing(2)
    },
    placeholderContainer: {
      textAlign: 'center',
      marginTop: theme.spacing(3)
    },
    nodeName: {
      padding: theme.spacing(1, 0),
      cursor: 'pointer'
    }
  }),
  { name: 'BaseTreeViewBrandSelector' }
)

export type NodeRenderer = {
  brand: IBrand
}

export interface BaseTreeViewBrandSelectorProps {
  hasError?: boolean
  isLoading?: boolean
  nodes: TreeFn<IBrand>
  initialExpandedNodes?: string[]
  nodeRenderer?: (props: NodeRenderer) => ReactNode
  onNodeClick?: (value?: IBrand) => void
}

export function BaseTreeViewBrandSelector({
  nodes,
  hasError = false,
  isLoading = false,
  initialExpandedNodes = [],
  onNodeClick = noop,
  nodeRenderer
}: BaseTreeViewBrandSelectorProps) {
  const [query, setQuery] = useState<string>('')
  const classes = useStyles()

  const [debouncedSetQuery] = useDebouncedCallback(setQuery, 400)
  const filteredNodes = useTeamsFilterHook(nodes, query)

  const renderNode = (brand: IBrand) => {
    if (!nodeRenderer) {
      return (
        <div className={classes.nodeName} onClick={() => onNodeClick(brand)}>
          <Typography variant="body2">{brand.name}</Typography>
        </div>
      )
    }

    return nodeRenderer({ brand })
  }

  if (isLoading) {
    return (
      <div className={classes.placeholderContainer}>
        <CircularProgress />
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={classes.placeholderContainer}>
        <Typography variant="body1" color="textSecondary">
          Somthing Went Wrong!
        </Typography>
      </div>
    )
  }

  return (
    <>
      <div className={classes.searchContainer}>
        <Search
          placeholder="Search for teams and agents"
          onChange={value => debouncedSetQuery(value)}
        />
      </div>
      <TreeView
        selectable
        getChildNodes={filteredNodes}
        initialExpandedNodes={initialExpandedNodes}
        getNodeId={getNodeId}
        renderNode={renderNode}
      />
    </>
  )
}
