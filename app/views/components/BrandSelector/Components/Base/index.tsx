import { useState, ReactNode } from 'react'

import {
  Typography,
  CircularProgress,
  Theme,
  makeStyles
} from '@material-ui/core'
import { useSelector } from 'react-redux'
import useDebouncedCallback from 'use-debounce/lib/callback'

import Search from '@app/views/components/Grid/Search'
import TreeView from '@app/views/components/TreeView'
import { selectUser } from 'selectors/user'
import { noop } from 'utils/helpers'

import { useTeam } from '../../hooks/use-team'

const getNodeId = (team: IBrand) => team.id

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {},
    searchContainer: {
      marginBottom: theme.spacing(2)
    },
    loading: {
      textAlign: 'center',
      marginTop: theme.spacing(3)
    },
    nodeName: {
      padding: theme.spacing(1, 0),
      cursor: 'pointer'
    }
  }),
  { name: 'BaseBrandSelector' }
)

export type NodeRenderer = {
  brand: IBrand
}

export interface BaseBrandSelectorProps {
  nodeRenderer?: (props: NodeRenderer) => ReactNode
  onNodeClick?: (brand?: IBrand) => void
}

export function BaseBrandSelector({
  onNodeClick = noop,
  nodeRenderer
}: BaseBrandSelectorProps) {
  const user = useSelector(selectUser)
  const classes = useStyles()
  const [query, setQuery] = useState<string>('')

  const { isError, isLoading, initialExpandedNodes, teamNodes } = useTeam(
    user,
    query
  )

  const [debouncedSetQuery] = useDebouncedCallback(setQuery, 400)

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

  const renderTreeView = () => {
    if (isLoading) {
      return (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      )
    }

    if (isError) {
      return (
        <Typography variant="body1" color="textSecondary">
          Somthing Went Wrong!
        </Typography>
      )
    }

    return (
      <TreeView
        selectable
        getChildNodes={teamNodes}
        initialExpandedNodes={initialExpandedNodes}
        getNodeId={getNodeId}
        renderNode={renderNode}
      />
    )
  }

  return (
    <div className={classes.container}>
      <div className={classes.searchContainer}>
        <Search
          placeholder="Search for teams and agents"
          onChange={value => debouncedSetQuery(value)}
        />
      </div>

      {renderTreeView()}
    </div>
  )
}
