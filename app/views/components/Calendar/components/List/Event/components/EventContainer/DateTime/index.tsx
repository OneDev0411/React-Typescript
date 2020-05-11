import React from 'react'
import fecha from 'fecha'

interface Props {
  event: ICalendarEvent
}

export function DateTime({ event }: Props) {
  if (isAllDayEvent(event)) {
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

function isAllDayEvent(event: ICalendarEvent) {
  if (event.metadata && typeof event.metadata.all_day === 'boolean') {
    return event.metadata.all_day
  }

  const isOneDayEvent = event.end_date
    ? formatDate(event.timestamp, 'YYYYMMDD') ===
      formatDate(event.end_date, 'YYYYMMDD')
    : true

  const isInternalEvent = [
    'crm_association',
    'crm_task',
    'email_campaign',
    'email_campaign_recipient',
    'email_thread_recipient'
  ].includes(event.object_type)

  if (!isInternalEvent || !isOneDayEvent) {
    return true
  }

  return false
}

function formatDate(date: Date | string | number, format: string): string {
  const dateObject = new Date(
    date instanceof Date ? date : parseFloat(date as string) * 1000
  )

  return fecha.format(dateObject, format)
}
