import React, { useState, useCallback } from 'react'

import { Button, Typography } from '@material-ui/core'
import { useSelector } from 'react-redux'

import Drawer from 'components/OverlayDrawer'
import TreeView from 'components/TreeView'
import Loading from 'partials/Loading'
import { selectUser } from 'selectors/user'

import { useTeam } from './hooks/use-team'

interface Props {}

const getNodeId = team => team.id

export function BrandSelector(props: Props) {
  const user = useSelector(selectUser)
  const { error, loading, rootTeam, initialExpandedNodes, getChildNodes } =
    useTeam(user)

  console.log({ error, loading, rootTeam, initialExpandedNodes, getChildNodes })

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const teamRenderer = useCallback(team => {
    console.log({ team })

    return <Typography variant="body2">{team.name}</Typography>
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
        <Drawer.Body>{renderTreeView()}</Drawer.Body>
      </Drawer>
    </>
  )
}
