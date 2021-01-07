import React, { useState } from 'react'
import { Button, Menu, MenuItem } from '@material-ui/core'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import MoreVertIcon from 'components/SvgIcons/MoreVert/IconMoreVert'

import DomainManagementDrawer, {
  DomainManagementDrawerProps
} from 'components/DomainManagementDrawer'

import useStyles from './styles'

export interface WebsiteCardMenuProps
  extends Pick<
    DomainManagementDrawerProps,
    'websiteId' | 'websiteTitle' | 'websiteHostnames'
  > {
  onDelete: () => void
  onEdit: () => void
}

export function WebsiteCardMenu({
  onDelete,
  onEdit,
  ...otherProps
}: WebsiteCardMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const classes = useStyles()
  const iconClasses = useIconStyles()

  const [isDomainManagementOpen, setIsDomainManagementOpen] = useState(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    onDelete()
    handleClose()
  }

  const handleEdit = () => {
    onEdit()
    handleClose()
  }

  const openDomainManagement = () => {
    setIsDomainManagementOpen(true)
    handleClose()
  }

  const closeDomainManagement = () => setIsDomainManagementOpen(false)

  return (
    <div>
      <Button
        color="secondary"
        variant="contained"
        size="small"
        onClick={handleClick}
        className={classes.button}
      >
        <MoreVertIcon fill="#fff" className={iconClasses.medium} />
      </Button>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={openDomainManagement}>Manage Domains</MenuItem>
        <MenuItem onClick={handleEdit}>Edit Website</MenuItem>
        <MenuItem onClick={handleDelete}>Delete Website</MenuItem>
      </Menu>

      <DomainManagementDrawer
        open={isDomainManagementOpen}
        onClose={closeDomainManagement}
        {...otherProps}
      />
    </div>
  )
}
