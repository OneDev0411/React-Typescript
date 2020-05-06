import React from 'react'
import fecha from 'fecha'

interface Props {
  event: ICalendarEvent
}

export function DateTime({ event }: Props) {
  const isAllDayEvent = () => {
    const { metadata, end_date, timestamp, object_type } = event

    if (metadata && typeof metadata.all_day !== 'undefined') {
      return metadata.all_day
    }

    const isOneDayEvent =
      end_date && getDatePartTicks(timestamp) === getDatePartTicks(end_date)
    const isInternalEvent = [
      'crm_association',
      'crm_task',
      'email_campaign',
      'email_campaign_recipient',
      'email_thread_recipient'
    ].includes(object_type)

    if (!isInternalEvent || !isOneDayEvent) {
      return true
    }

    return false
  }

  if (isAllDayEvent()) {
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
  return fecha.format(toDateObject(date), 'hh:mm\u00A0A') // non-breaking space
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
function getDatePartTicks(date: Date | string | number): number {
  return getDatePart(toDateObject(date)).getTime()
}
