import React, { useContext } from 'react'
import Button from '@material-ui/core/Button'

import { ListContext } from '../../../../context'

interface Props {
  event: ICalendarEvent
}

export function SendBirthdayCard({ event }: Props) {
  const { actions } = useContext(ListContext)

  const handleClick = () => {
    actions.emit('event-action', { event })
  }

  if (event.event_type === 'birthday' && !event.metadata.is_partner) {
    return (
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        onClick={handleClick}
      >
        Send Birthday Card
      </Button>
    )
  }

  return null
}
