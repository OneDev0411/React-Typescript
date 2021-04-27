import { useState } from 'react'

import ShowingDetailTabBookingsFilterList from './ShowingDetailTabBookingsFilterList'
import ShowingDetailTabBookingsList from './ShowingDetailTabBookingsList'
import useAppointmentFilterInfo from './use-appointment-filter-info'
import useFilterAppointments from './use-filter-appointments'
import useSortAppointments from './use-sort-appointments'
import useAppointmentListInfo from './use-appointment-list-info'
import { AppointmentFilter } from './types'

interface ShowingDetailTabBookingsProps {
  appointments: IShowingAppointment[]
  duration: number
}

function ShowingDetailTabBookings({
  appointments,
  duration
}: ShowingDetailTabBookingsProps) {
  const [filter, setFilter] = useState<AppointmentFilter>('All')

  const filterInfo = useAppointmentFilterInfo(filter)

  const sortedAppointments = useSortAppointments(appointments)

  const filteredAppointments = useFilterAppointments(
    sortedAppointments,
    filterInfo
  )

  const {
    hasNotifications,
    notificationsTitle,
    hasBookings,
    bookingsTitle
  } = useAppointmentListInfo(filter)

  return (
    <>
      <ShowingDetailTabBookingsFilterList
        appointments={appointments}
        value={filter}
        onChange={setFilter}
      />
      {hasNotifications && (
        <ShowingDetailTabBookingsList
          title={notificationsTitle}
          rows={filteredAppointments}
          duration={duration}
          glowMode
        />
      )}
      {hasBookings && (
        <ShowingDetailTabBookingsList
          title={bookingsTitle}
          rows={filteredAppointments}
          duration={duration}
        />
      )}
    </>
  )
}

export default ShowingDetailTabBookings
