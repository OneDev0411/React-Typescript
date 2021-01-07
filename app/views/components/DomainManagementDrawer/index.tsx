import React from 'react'

import { Box } from '@material-ui/core'

import Drawer, { OverlayDrawerProps } from 'components/OverlayDrawer'

interface DomainManagementDrawerProps extends OverlayDrawerProps {
  websiteId: IWebsite['id']
  websiteTitle: IWebsite['title']
  websiteHostnames: IWebsite['hostnames']
}

function DomainManagementDrawer({
  open,
  onClose,
  websiteHostnames
}: DomainManagementDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose}>
      <Drawer.Header title="Domain Management" />
      <Drawer.Body>
        <Box marginTop={3} marginBottom={3}>
          You current domains:
          <ul>
            {websiteHostnames.map(hostname => (
              <li key={hostname}>{hostname}</li>
            ))}
          </ul>
        </Box>
      </Drawer.Body>
    </Drawer>
  )
}

export default DomainManagementDrawer
