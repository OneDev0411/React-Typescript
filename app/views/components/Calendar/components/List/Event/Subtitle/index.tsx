import React from 'react'

import { LastTouched } from 'components/LastTouched'

interface Props {
  event: ICalendarEvent
}

export function EventSubTitle({ event }: Props) {
  if (event.object_type === 'crm_task') {
    return event.title
  }

  if (event.object_type === 'contact' && event.event_type === 'next_touch') {
    return <LastTouched contact={event.full_contact as IContact} />
  }

  return null
}
