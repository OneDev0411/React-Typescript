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

  return (
    <>
      <ShowingDetailTabBookingsFilterList
        appointments={appointments}
        value={filter}
        onChange={setFilter}
      />
      <ShowingDetailTabBookingsList
        filter={filter}
        appointments={appointments}
        duration={duration}
      />
    </>
  )
}

export default ShowingDetailTabBookings
