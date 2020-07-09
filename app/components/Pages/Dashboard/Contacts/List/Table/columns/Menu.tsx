import React from 'react'
import { mdiDotsHorizontal } from '@mdi/js'

import { IconButton, MenuItem, Typography } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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
          <SvgIcon path={mdiDotsHorizontal} />
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
