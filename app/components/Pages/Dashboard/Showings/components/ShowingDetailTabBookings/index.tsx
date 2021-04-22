import { useState } from 'react'

import ShowingDetailTabBookingsFilterList from './ShowingDetailTabBookingsFilterList'

interface ShowingDetailTabBookingsProps {
  appointments: IShowingAppointment[]
}

function ShowingDetailTabBookings({
  appointments
}: ShowingDetailTabBookingsProps) {
  const [filter, setFilter] = useState<IAppointmentStatus>('Requested')

  return (
    <>
      <ShowingDetailTabBookingsFilterList
        appointments={appointments}
        value={filter}
        onChange={setFilter}
      />
    </>
  )
}

export default ShowingDetailTabBookings
