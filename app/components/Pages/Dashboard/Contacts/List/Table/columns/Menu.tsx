import React from 'react'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import { IconButton, MenuItem, Typography } from '@material-ui/core'

import { BaseDropdown } from 'components/BaseDropdown'

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
  return (
    <BaseDropdown
      PopperProps={{
        placement: 'bottom-end'
      }}
      renderDropdownButton={buttonProps => (
        <IconButton {...buttonProps}>
          <MoreHorizIcon />
        </IconButton>
      )}
      renderMenu={({ close }) => (
        <div>
          <MenuItem
            onClick={e => {
              close()
              handleOnDelete(e, {
                singleSelectedRow: [contactId]
              })
            }}
          >
            <Typography color="error">Delete</Typography>
          </MenuItem>
        </div>
      )}
    />
  )
}
