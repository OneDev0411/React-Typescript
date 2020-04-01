import React from 'react'
import fecha from 'fecha'

interface Props {
  event: ICalendarEvent
}

export function DateTime({ event }: Props) {
  if (
    ![
      'crm_association',
      'crm_task',
      'email_campaign',
      'email_campaign_recipient',
      'email_thread_recipient'
    ].includes(event.object_type)
  ) {
    return <span>All day</span>
  }

  const dueDate = formatDate(event.timestamp)

  if (event.end_date) {
    const sameDay =
      getDatePart(toDateObject(event.timestamp)).getTime() ===
      getDatePart(toDateObject(event.end_date)).getTime()

    return (
      <span>
        {dueDate} {formatDate(event.end_date, sameDay)}
      </span>
    )
  }

  return <span>{dueDate}</span>
}

function formatDate(
  date: Date | string | number,
  timePartOnly: boolean = true
): string {
  return fecha.format(
    toDateObject(date),
    timePartOnly ? 'hh:mm\u00A0A' : 'MMM\u00A0D,\u00A0hh:mm\u00A0A'
  )
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
