import React from 'react'
import { mdiDotsHorizontal } from '@mdi/js'
import Icon from '@mdi/react'
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
          <Icon path={mdiDotsHorizontal} size={1} />
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
