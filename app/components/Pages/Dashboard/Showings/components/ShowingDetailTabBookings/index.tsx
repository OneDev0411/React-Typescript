import { useState, useMemo } from 'react'

import ShowingDetailTabBookingsFilterList from './ShowingDetailTabBookingsFilterList'
import ShowingDetailTabBookingsList from './ShowingDetailTabBookingsList'

interface ShowingDetailTabBookingsProps {
  appointments: IShowingAppointment[]
  duration: number
}

function ShowingDetailTabBookings({
  appointments,
  duration
}: ShowingDetailTabBookingsProps) {
  const [filter, setFilter] = useState<IAppointmentStatus>('Requested')

  const sortedAppointments = useMemo(
    () =>
      [...appointments].sort((a, b) => {
        const time1 = new Date(a.time)
        const time2 = new Date(b.time)

        if (time1 < time2) {
          return -1
        }

        if (time1 > time2) {
          return 1
        }

        return 0
      }),
    [appointments]
  )

  // TODO: remove this after finishing development
  // const modifiedAppointments = appointments.map<IShowingAppointment>(
  //   appointment => ({
  //     ...appointment,
  //     status: 'Completed'
  //   })
  // )
  const modifiedAppointments = sortedAppointments

  return (
    <>
      <ShowingDetailTabBookingsFilterList
        appointments={modifiedAppointments}
        value={filter}
        onChange={setFilter}
      />
      <ShowingDetailTabBookingsList
        filter={filter}
        appointments={modifiedAppointments}
        duration={duration}
      />
    </>
  )
}

export default ShowingDetailTabBookings
