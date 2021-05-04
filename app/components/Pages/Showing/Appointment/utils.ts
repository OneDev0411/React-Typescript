import { addSeconds } from 'date-fns'
import fecha from 'fecha'

import { convertShowingTimeToLocalTime } from '../Book/Sections/BookSection/utils'

const APPOINTMENT_STATUS_LABEL_MAP: Record<
  IShowingAppointmentStatus,
  string
> = {
  Requested: 'Requested',
  Confirmed: 'Confirmed',
  Rescheduled: 'Rescheduled',
  Canceled: 'Canceled',
  Completed: 'Completed'
}

export function getAppointmentStatusLabel(
  appointment: IShowingAppointment | IPublicShowingAppointment
): string {
  return APPOINTMENT_STATUS_LABEL_MAP[appointment.status]
}

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

  const timezoneName =
    appointment.showing.timezone_offset === new Date().getTimezoneOffset()
      ? ''
      : `(${appointment.showing.timezone})`

  return `${fecha.format(
    convertShowingTimeToLocalTime(appointment.showing, start),
    'MMMM D, h:mm'
  )} - ${fecha.format(
    convertShowingTimeToLocalTime(appointment.showing, end),
    'h:mm A'
  )} ${timezoneName}`
}
