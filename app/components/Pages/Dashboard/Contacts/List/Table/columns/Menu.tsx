import React, { useState } from 'react'

import { IconButton, MenuItem, Typography, Popover } from '@material-ui/core'
import { mdiDotsHorizontal } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

interface Props {
  contactId: UUID
  handleOnDelete: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>,
    rows: {
      singleSelectedRow: [string]
    }
  ) => void
}

export default function Menu({ contactId, handleOnDelete }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'menu-popover' : undefined

  return (
    <>
      <IconButton size="small" onClick={handleClick}>
        <SvgIcon path={mdiDotsHorizontal} />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <MenuItem
          onClick={e => {
            handleOnDelete(e, {
              singleSelectedRow: [contactId]
            })
          }}
        >
          <Typography color="error">Delete</Typography>
        </MenuItem>
      </Popover>
    </>
  )
}
