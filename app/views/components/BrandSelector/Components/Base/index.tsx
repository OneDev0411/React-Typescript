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
  rootBrandId?: UUID
}

export function BaseBrandSelector({
  onNodeClick = noop,
  nodeRenderer,
  rootBrandId
}: BaseBrandSelectorProps) {
  const user = useSelector(selectUser)
  const classes = useStyles()
  const [query, setQuery] = useState<string>('')

  const { error, loading, initialExpandedNodes, getChildNodes } = useTeam(
    user,
    query,
    rootBrandId
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
    if (loading) {
      return (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      )
    }

    if (error) {
      return (
        <Typography variant="body1" color="textSecondary">
          Something went wrong!
        </Typography>
      )
    }

    return (
      <TreeView
        selectable
        getChildNodes={getChildNodes}
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
