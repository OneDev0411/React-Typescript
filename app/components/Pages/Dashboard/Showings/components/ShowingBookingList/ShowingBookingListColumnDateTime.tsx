import { getAppointmentDateLabel, getAppointmentTimeLabel } from './helpers'
import ShowingBookingListColumnBase from './ShowingBookingListColumnBase'

interface ShowingBookingListColumnDateTimeProps {
  time: string
  duration: number
}

function ShowingBookingListColumnDateTime({
  time,
  duration
}: ShowingBookingListColumnDateTimeProps) {
  return (
    <ShowingBookingListColumnBase>
      <div>{getAppointmentDateLabel(time)}</div>
      {getAppointmentTimeLabel(time, duration)}
    </ShowingBookingListColumnBase>
  )
}

export default ShowingBookingListColumnDateTime
