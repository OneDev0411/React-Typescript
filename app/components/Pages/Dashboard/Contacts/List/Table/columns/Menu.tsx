import React from 'react'

import { IconButton, MenuItem, Typography } from '@material-ui/core'

import { BaseDropdown } from 'components/BaseDropdown'

import IconHorizontalDots from 'components/SvgIcons/HorizontalDots/IconHorizontalDots'

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
          <IconHorizontalDots />
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
