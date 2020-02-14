import React, { CSSProperties, memo } from 'react'

import { EventHeader } from '../EventHeader'
import { Event } from '../Event'

interface Props {
  index: number
  style: CSSProperties
  data: {
    rows: ICalendarListRow[]
    activeDate: Date | null
    onEventChange: (event: IEvent, type: string) => void
  }
}

export const Row = memo(
  ({ index, style, data: { rows, activeDate, onEventChange } }: Props) => (
    <>
      {rows[index].hasOwnProperty('isEventHeader') ? (
        <EventHeader
          item={rows[index] as ICalendarEventHeader}
          style={style}
          activeDate={activeDate}
        />
      ) : (
        <Event
          key={(rows[index] as ICalendarEvent).id}
          event={rows[index] as ICalendarEvent}
          style={style}
          onEventChange={onEventChange}
        />
      )}
    </>
  )
)
