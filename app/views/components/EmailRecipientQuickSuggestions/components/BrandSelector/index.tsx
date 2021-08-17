import React, { useState } from 'react'

import { Box, Button } from '@material-ui/core'
import { useSelector } from 'react-redux'

import Drawer from 'components/OverlayDrawer'
import { selectUser } from 'selectors/user'

import { useTeam } from './hooks/use-team'

interface Props {}

export function BrandSelector(props: Props) {
  const user = useSelector(selectUser)
  const team = useTeam(user)

  console.log({ team })

  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <>
      <Button size="small" onClick={() => setIsOpen(true)}>
        More
      </Button>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
        <Drawer.Header title="Select Team" />
        <Drawer.Body>
          <Box p={1}>sdsd</Box>
        </Drawer.Body>
      </Drawer>
    </>
  )
}
