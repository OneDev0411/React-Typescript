import React, { useState, useEffect } from 'react'

import { useLoadCalendar } from './hooks/use-load-calendar'

import { getDateRange, Format } from './helpers/get-date-range'

interface IProps {
  range: [number, number]
  children: React.ReactNode
}

const Calendar: React.FC = (props: IProps) => {
  const [range, setRange] = useState<[number, number]>(getDateRange())
  const [viewAsUsers, setViewAsUsers] = useState<UUID[]>([])

  const { events } = useLoadCalendar({ range, users: viewAsUsers })

  return (
    <div>
      {Object.entries(events).map(([day, events]) => {
        return (
          <div key={day} style={{ borderBottom: '2px solid #ccc' }}>
            {day}

            {(events as CalendarEvent[]).map((event, eventIndex) => (
              <div key={eventIndex}>{event.title}</div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default Calendar
