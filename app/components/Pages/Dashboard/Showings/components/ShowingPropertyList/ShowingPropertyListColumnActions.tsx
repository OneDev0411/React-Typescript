import { MouseEvent } from 'react'

import { Box, IconButton, MenuItem } from '@material-ui/core'
import InsertInvitationIcon from '@material-ui/icons/InsertInvitation'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'

import { BaseDropdown } from 'components/BaseDropdown'

import LinkButton from '../LinkButton'

interface ShowingPropertyListColumnActionsProps {
  className: string
  showingId: UUID
}

function ShowingPropertyListColumnActions({
  className,
  showingId
}: ShowingPropertyListColumnActionsProps) {
  const handleClick = (event: MouseEvent) => {
    event.stopPropagation()
  }

  return (
    <Box
      className={className}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      paddingRight={4}
      onClick={handleClick}
    >
      <Box mx={1}>
        <LinkButton
          size="small"
          variant="outlined"
          to={`/showings/${showingId}/book`}
          target="_blank"
          startIcon={<InsertInvitationIcon />}
          color="default"
        >
          Booking Page
        </LinkButton>
      </Box>

      <BaseDropdown
        PopperProps={{
          placement: 'bottom-end'
        }}
        renderDropdownButton={buttonProps => (
          <IconButton {...buttonProps} style={{ padding: 0 }}>
            <MoreHorizIcon />
          </IconButton>
        )}
        renderMenu={({ close }) => (
          <div>
            <MenuItem>Option 1</MenuItem>
            <MenuItem>Option 2</MenuItem>
          </div>
        )}
      />
    </Box>
  )
}

export default ShowingPropertyListColumnActions
