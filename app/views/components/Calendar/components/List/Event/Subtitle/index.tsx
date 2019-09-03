import React from 'react'

import { TouchDate } from './TouchDate'

interface Props {
  event: ICalendarEvent
}

export function EventSubTitle({ event }: Props) {
  if (['crm_task', 'crm_association'].includes(event.object_type)) {
    return <span>{event.title}</span>
  }

  if (event.object_type === 'contact' && event.event_type === 'next_touch') {
    return <TouchDate event={event} />
  }

  return null
}
