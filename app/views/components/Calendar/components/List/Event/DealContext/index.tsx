import React from 'react'

import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'

import { EventContainer } from '../components/EventContainer'

interface Props {
  style: React.CSSProperties
  event: ICalendarEvent
}

export function DealContext({ style, event, item, nextItem }: Props) {
  const icon = eventIcons['Task Critical']

  return (
    <EventContainer
      style={style}
      event={event}
      Icon={icon.icon}
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
