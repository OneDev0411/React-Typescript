import { ReactNode } from 'react'

import {
  Typography,
  CircularProgress,
  Theme,
  makeStyles
} from '@material-ui/core'

import { noop } from '@app/utils/helpers'
import { TreeFn } from '@app/utils/tree-utils/types'
import Search from '@app/views/components/Grid/Search'
import TreeView from '@app/views/components/TreeView'

import { UseFilterTeamsReturnType } from '../../../hooks/use-filter-teams'

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
      cursor: 'pointer'
    }
  }),
  { name: 'BaseTreeViewBrandSelector' }
)

export type NodeRenderer = {
  brand: IBrand
}

export interface BaseTreeViewBrandSelectorProps
  extends Omit<UseFilterTeamsReturnType, 'filterTeams'> {
  hasError?: boolean
  isLoading?: boolean
  searchPlaceholder?: string
  nodes: TreeFn<IBrand>
  shouldExpandOnNodeClick?: boolean
  initialExpandedNodes?: string[]
  nodeRenderer?: (props: NodeRenderer) => ReactNode
  onNodeClick?: (value?: IBrand) => void
}

export function BaseTreeViewBrandSelector({
  nodes,
  hasError = false,
  isLoading = false,
  shouldExpandOnNodeClick = false,
  initialExpandedNodes = [],
  searchPlaceholder = 'Search for teams and agents',
  handleSearch,
  onNodeClick = noop,
  nodeRenderer
}: BaseTreeViewBrandSelectorProps) {
  const classes = useStyles()

  const renderNode = (brand: IBrand) => {
    if (!nodeRenderer) {
      return (
        <div className={classes.nodeName} onClick={() => onNodeClick(brand)}>
          {brand.name}
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
          Something Went Wrong!
        </Typography>
      </div>
    )
  }

  return (
    <>
      <div className={classes.searchContainer}>
        <Search
          autoFocus
          placeholder={searchPlaceholder}
          onChange={value => handleSearch(value)}
        />
      </div>
      <TreeView
        selectable
        getChildNodes={nodes}
        shouldExpandOnNodeClick={shouldExpandOnNodeClick}
        initialExpandedNodes={initialExpandedNodes}
        getNodeId={getNodeId}
        renderNode={renderNode}
      />
    </>
  )
}
