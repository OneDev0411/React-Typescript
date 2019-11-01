import React from 'react'
import fecha from 'fecha'

interface Props {
  event: ICalendarEvent
}

export function DateTime({ event }: Props) {
  if (['crm_association', 'crm_task'].includes(event.object_type) === false) {
    return <span>All day</span>
  }

  const dueDate = formatDate(event.timestamp)

  if (event.end_date) {
    return (
      <span>
        {dueDate} - {formatDate(event.end_date)}
      </span>
    )
  }

  return <span>${dueDate}</span>
}

function formatDate(date: Date | string | number): string {
  return fecha.format(
    new Date(typeof date === 'number' ? date * 1000 : date),
    'hh:mma'
  )
}
