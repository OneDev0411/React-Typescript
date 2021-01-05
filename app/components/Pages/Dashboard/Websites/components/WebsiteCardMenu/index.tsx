import React from 'react'
import { Button, Menu, MenuItem } from '@material-ui/core'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import MoreVertIcon from 'components/SvgIcons/MoreVert/IconMoreVert'

import useStyles from './styles'

export interface WebsiteCardMenuProps {
  onDelete: () => void
  onEdit: () => void
}

export function WebsiteCardMenu({ onDelete, onEdit }: WebsiteCardMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const classes = useStyles()
  const iconClasses = useIconStyles()

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
        <MenuItem onClick={handleEdit}>Edit Site</MenuItem>
        <MenuItem onClick={handleDelete}>Delete Site</MenuItem>
      </Menu>
    </div>
  )
}
