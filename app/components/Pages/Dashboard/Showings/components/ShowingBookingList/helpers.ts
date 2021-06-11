import { format } from 'fecha'

const dateFormat = 'dddd, MMMM DD'

const todayDate = new Date()
const todayLabel = format(todayDate, dateFormat)
const tomorrowLabel = format(
  todayDate.setDate(todayDate.getDate() + 1),
  dateFormat
)

export function getAppointmentDateLabel(
  appointmentTime: string,
  customDateFormat: string = dateFormat
): string {
  const time = new Date(appointmentTime)
  const timeLabel = format(time, customDateFormat)

  switch (timeLabel) {
    case todayLabel:
      return 'Today'
    case tomorrowLabel:
      return 'Tomorrow'
    default:
      return timeLabel
  }
}

export function getAppointmentTimeLabel(
  appointmentTime: string,
  duration: number
): string {
  const timeFormat = 'hh:mm'
  const startTime = new Date(appointmentTime)
  const endTime = new Date(startTime.getTime() + duration * 1000)

  return `${format(startTime, timeFormat)} - ${format(
    endTime,
    `${timeFormat} A`
  )}`
}

export function getAppointmentFeedbackSubtitle(
  appointment: IShowingAppointment
): string {
  return [
    (appointment.showing as IShowing).title,
    ' — ',
    getAppointmentDateLabel(appointment.time, 'MMMM DD'),
    ', ',
    getAppointmentTimeLabel(
      appointment.time,
      (appointment.showing as IShowing).duration
    )
  ].join('')
}
