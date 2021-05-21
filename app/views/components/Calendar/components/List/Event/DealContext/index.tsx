import React from 'react'

import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'

import { EventContainer } from '../components/EventContainer'

interface Props {
  event: ICalendarEvent
}

export function DealContext({ event }: Props) {
  const icon = eventIcons['Task Critical']

  return (
    <EventContainer
      event={event}
      Icon={icon.icon}
      editable={false}
      title={
        <div>
          {event.type_label} for{' '}
          <a href={`/dashboard/deals/${event.deal}`} target="_blank">
            {event.title}
          </a>
        </div>
      }
    />
  )
}
