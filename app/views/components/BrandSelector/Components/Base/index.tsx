import { useState, ReactNode } from 'react'

import {
  Typography,
  CircularProgress,
  Theme,
  makeStyles
} from '@material-ui/core'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'

import Search from '@app/views/components/Grid/Search'
import TreeView from '@app/views/components/TreeView'
import { selectUser } from 'selectors/user'

import { useTeam } from '../../hooks/use-team'

const getNodeId = (team: IBrand) => team.id

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {},
    searchContainer: {
      margin: theme.spacing(2, 0)
    },
    team: {
      padding: theme.spacing(1, 0),
      cursor: 'pointer'
    },
    loading: {
      textAlign: 'center',
      marginTop: theme.spacing(3)
    },
    nodeName: {
      padding: theme.spacing(1, 0)
    }
  }),
  { name: 'BaseBrandSelector' }
)

export type NodeRenderer = {
  brand: IBrand
  // onClickCallBack?: (brand?: IBrand) => void
}

interface Props {
  nodeRenderer?: (props: NodeRenderer) => ReactNode
}

export function BrandSelectorDrawer({ nodeRenderer }: Props) {
  const user = useSelector(selectUser)
  const classes = useStyles()
  const [query, setQuery] = useState<string>('')

  const { error, loading, initialExpandedNodes, getChildNodes } = useTeam(
    user,
    query
  )

  const debouncedSetQuery = debounce(setQuery, 400)

  const renderNode = (brand: IBrand) => {
    if (!nodeRenderer) {
      return (
        <div className={classes.nodeName}>
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
          Somthing Went Wrong!
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
