import React from 'react'

import { ButtonGroup, Button } from './styled'

interface Props {
  onNewEventClick: () => any
  onNewScheduledEmailClick: () => any
}

export default function AddButton({
  onNewEventClick,
  onNewScheduledEmailClick
}: Props) {
  return (
    <ButtonGroup>
      <Button onClick={onNewEventClick}>Add an event</Button>
      <Button onClick={onNewScheduledEmailClick}>Add a scheduled email</Button>
    </ButtonGroup>
  )
}
