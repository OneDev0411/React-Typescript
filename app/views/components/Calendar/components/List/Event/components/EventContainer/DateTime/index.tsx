import React from 'react'
import fecha from 'fecha'

interface Props {
  event: ICalendarEvent
}

export function DateTime({ event }: Props) {
  if (event.all_day) {
    return <span>All day</span>
  }

  const timeFormat = 'hh:mm\u00A0A'
  const dueDate = formatDate(event.timestamp, timeFormat)

  if (event.end_date) {
    return (
      <span>
        {dueDate} {formatDate(event.end_date, timeFormat)}
      </span>
    )
  }

  return <span>{dueDate}</span>
}

function formatDate(date: Date | string | number, format: string): string {
  const dateObject = new Date(
    date instanceof Date ? date : parseFloat(date as string) * 1000
  )

  return fecha.format(dateObject, format)
}
