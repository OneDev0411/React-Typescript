import { format } from 'fecha'

const dateFormat = 'dddd, MMMM DD, YYYY'

const todayDate = new Date()
const todayLabel = format(todayDate, dateFormat)
const tomorrowLabel = format(
  todayDate.setDate(todayDate.getDate() + 1),
  dateFormat
)

export function getAppointmentTimeLabel(appointmentTime: string): string {
  const time = new Date(appointmentTime)
  const timeLabel = format(time, dateFormat)

  switch (timeLabel) {
    case todayLabel:
      return 'Today'
    case tomorrowLabel:
      return 'Tomorrow'
    default:
      return timeLabel
  }
}
