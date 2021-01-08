import React from 'react'

import { Box } from '@material-ui/core'

import Drawer, { OverlayDrawerProps } from 'components/OverlayDrawer'
import DomainManagement, {
  DomainManagementProps
} from 'components/DomainManagement'

export interface DomainManagementDrawerProps
  extends OverlayDrawerProps,
    DomainManagementProps {
  websiteTitle: IWebsite['title']
}

function DomainManagementDrawer({
  open,
  onClose,
  websiteTitle,
  ...otherProps
}: DomainManagementDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose}>
      <Drawer.Header title="Domain Management" />
      <Drawer.Body>
        <Box marginTop={3} marginBottom={3}>
          Website: {websiteTitle}
          <br />
          <DomainManagement {...otherProps} />
        </Box>
      </Drawer.Body>
    </Drawer>
  )
}

export default DomainManagementDrawer
