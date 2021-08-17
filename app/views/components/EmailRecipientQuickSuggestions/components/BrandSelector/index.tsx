import React, { useState, useCallback } from 'react'

import { Button, Typography, Theme, makeStyles } from '@material-ui/core'
import { debounce } from 'lodash'
import { useSelector } from 'react-redux'

import Search from 'components/Grid/Search'
import Drawer from 'components/OverlayDrawer'
import TreeView from 'components/TreeView'
import Loading from 'partials/Loading'
import { selectUser } from 'selectors/user'

import { useTeam } from './hooks/use-team'

const getNodeId = team => team.id

const useStyles = makeStyles(
  (theme: Theme) => ({
    searchContaoner: {
      margin: theme.spacing(2, 0)
    },
    team: {
      padding: theme.spacing(1, 0),
      cursor: 'pointer'
    }
  }),
  { name: 'BrandSelector' }
)

interface Props {}

export function BrandSelector(props: Props) {
  const user = useSelector(selectUser)
  const classes = useStyles()
  const [searchKey, setSearchKey] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { error, loading, rootTeam, initialExpandedNodes, getChildNodes } =
    useTeam(user, searchKey)

  console.log({ error, loading, rootTeam, initialExpandedNodes, getChildNodes })

  const debouncedSetSearchKey = debounce(setSearchKey, 400)

  const teamRenderer = useCallback(team => {
    console.log({ team })

    return (
      <div className={classes.team}>
        <Typography variant="body2">{team.name}</Typography>
      </div>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderTreeView = () => {
    if (loading) {
      return <Loading />
    }

    if (error) {
      return <span>Error</span>
    }

    return (
      <TreeView
        getChildNodes={getChildNodes}
        selectable
        initialExpandedNodes={initialExpandedNodes}
        getNodeId={getNodeId}
        renderNode={teamRenderer}
      />
    )
  }

  return (
    <>
      <Button size="small" onClick={() => setIsOpen(true)}>
        More
      </Button>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
        <Drawer.Header title="Select Team" />
        <Drawer.Body>
          <div className={classes.searchContaoner}>
            <Search
              placeholder="Search for teams and agents"
              onChange={value => debouncedSetSearchKey(value)}
            />
          </div>

          {renderTreeView()}
        </Drawer.Body>
      </Drawer>
    </>
  )
}
