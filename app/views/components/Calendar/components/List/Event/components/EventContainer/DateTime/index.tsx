import fecha from 'fecha'

interface Props {
  event: ICalendarEvent
}

export function DateTime({ event }: Props) {
  if (['crm_association', 'crm_task'].includes(event.object_type) === false) {
    return 'All day'
  }

  const dueDate = formatDate(event.timestamp)

  if (event.end_date) {
    return `${dueDate} - ${formatDate(event.end_date)}`
  }

  return dueDate
}

function formatDate(date: Date | string | number): string {
  return fecha.format(
    new Date(typeof date === 'number' ? date * 1000 : date),
    'hh:mma'
  )
}
