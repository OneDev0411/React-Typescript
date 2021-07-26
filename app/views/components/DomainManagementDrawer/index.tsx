import React from 'react'

import { Box } from '@material-ui/core'

import DomainManagement, {
  DomainManagementProps
} from 'components/DomainManagement'
import Drawer, { OverlayDrawerProps } from 'components/OverlayDrawer'

export type DomainManagementDrawerProps = OverlayDrawerProps &
  DomainManagementProps

function DomainManagementDrawer({
  open,
  onClose,
  ...otherProps
}: DomainManagementDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose}>
      <Drawer.Header title="Manage Domains" />
      <Drawer.Body>
        <Box marginTop={3} marginBottom={3}>
          <DomainManagement {...otherProps} />
        </Box>
      </Drawer.Body>
    </Drawer>
  )
}

export default DomainManagementDrawer
