import { MouseEvent } from 'react'

import { Box } from '@material-ui/core'
import InsertInvitationIcon from '@material-ui/icons/InsertInvitation'

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
      paddingRight={2}
      onClick={handleClick}
    >
      <div />

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
  )
}

export default ShowingPropertyListColumnActions
