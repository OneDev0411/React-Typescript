import React from 'react'
import fecha from 'fecha'

interface Props {
  event: ICalendarEvent
}

export function DateTime({ event }: Props) {
  const startsAndFinishesInTheSameDay =
    !!event.end_date &&
    getDatePart(toDateObject(event.timestamp)).getTime() ===
      getDatePart(toDateObject(event.end_date)).getTime()

  if (
    ![
      'crm_association',
      'crm_task',
      'email_campaign',
      'email_campaign_recipient',
      'email_thread_recipient'
    ].includes(event.object_type) ||
    !startsAndFinishesInTheSameDay
  ) {
    return <span>All day</span>
  }

  const dueDate = formatDate(event.timestamp)

  if (event.end_date) {
    return (
      <span>
        {dueDate} {formatDate(event.end_date)}
      </span>
    )
  }

  return <span>{dueDate}</span>
}

function formatDate(date: Date | string | number): string {
  return fecha.format(toDateObject(date), 'hh:mm\u00A0A')
}
function toDateObject(date: Date | string | number): Date {
  return new Date(
    date instanceof Date ? date : parseFloat(date as string) * 1000
  )
}
function getDatePart(date: Date): Date {
  const clone = new Date(date)

  clone.setHours(0, 0, 0, 0)

  return clone
}
