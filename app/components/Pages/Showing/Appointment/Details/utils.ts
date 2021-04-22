import { addSeconds } from 'date-fns'
import fecha from 'fecha'

export function getAppointmentRange(
  appointment: IPublicShowingAppointment<'showing'>
): [Date, Date] {
  const start = new Date(appointment.time)
  const end = addSeconds(start, appointment.showing.duration)

  return [start, end]
}

export function getFormattedAppointmentDateTime(
  appointment: IPublicShowingAppointment<'showing'>
): string {
  const [start, end] = getAppointmentRange(appointment)

  return `${fecha.format(start, 'MMMM D, h:mm')} - ${fecha.format(end, 'h:mm')}`
}
