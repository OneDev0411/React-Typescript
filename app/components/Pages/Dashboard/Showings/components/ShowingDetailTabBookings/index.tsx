import { useState } from 'react'

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

  // TODO: remove this after finishing development
  // const modifiedAppointments = appointments.map<IShowingAppointment>(
  //   appointment => ({
  //     ...appointment,
  //     status: 'Completed'
  //   })
  // )
  const modifiedAppointments = appointments

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
