import React from 'react'
import { Button, Menu, MenuItem } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import MoreVertIcon from 'components/SvgIcons/MoreVert/IconMoreVert'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      minWidth: 'auto',
      backgroundColor: theme.palette.action.active
    }
  })
)

export interface SiteMenuProps {
  onDelete: () => void
}

export function SiteMenu({ onDelete }: SiteMenuProps) {
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

  return (
    <div>
      <Button
        color="secondary"
        variant="contained"
        size="small"
        onClick={handleClick}
        className={classes.menuButton}
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
        <MenuItem onClick={handleClose}>Edit Site</MenuItem>
        <MenuItem onClick={handleDelete}>Delete Site</MenuItem>
      </Menu>
    </div>
  )
}
