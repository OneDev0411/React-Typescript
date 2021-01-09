import React from 'react'

import { Box } from '@material-ui/core'

import Drawer, { OverlayDrawerProps } from 'components/OverlayDrawer'
import DomainManagement, {
  DomainManagementProps
} from 'components/DomainManagement'

export type DomainManagementDrawerProps = OverlayDrawerProps &
  DomainManagementProps

function DomainManagementDrawer({
  open,
  onClose,
  ...otherProps
}: DomainManagementDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose}>
      <Drawer.Header title="Domain Management" />
      <Drawer.Body>
        <Box marginTop={3} marginBottom={3}>
          <DomainManagement {...otherProps} />
        </Box>
      </Drawer.Body>
    </Drawer>
  )
}

export default DomainManagementDrawer
