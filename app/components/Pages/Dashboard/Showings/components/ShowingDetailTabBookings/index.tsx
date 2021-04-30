import { useState } from 'react'

import { AppointmentFilter } from '../../types'
import useAppointmentFilterInfo from '../../hooks/use-appointment-filter-info'
import useFilterAppointments from './use-filter-appointments'
import useSortAppointments from '../../hooks/use-sort-appointments'
import useAppointmentNotificationLists from '../../hooks/use-appointment-notification-lists'
import ShowingAppointmentFilters from '../ShowingAppointmentFilters'
import ShowingDetailTabBookingsList from './ShowingDetailTabBookingsList'
import useAppointmentListInfo from './use-appointment-list-info'

interface ShowingDetailTabBookingsProps {
  appointments: IShowingAppointment[]
  duration: number
}

function ShowingDetailTabBookings({
  appointments: allAppointments,
  duration
}: ShowingDetailTabBookingsProps) {
  const [filter, setFilter] = useState<AppointmentFilter>('All')

  const filterInfo = useAppointmentFilterInfo(filter)

  const sortedAppointments = useSortAppointments(allAppointments)

  const { appointments, notifications } = useAppointmentNotificationLists(
    sortedAppointments
  )

  const filteredAppointments = useFilterAppointments(appointments, filterInfo)
  const filteredNotifications = useFilterAppointments(notifications, filterInfo)

  const {
    hasNotifications,
    notificationsTitle,
    notificationsEmptyMessage,
    hasBookings,
    bookingsTitle,
    bookingsEmptyMessage
  } = useAppointmentListInfo(filter)

  const isBothListEmpty =
    hasNotifications &&
    !filteredNotifications.length &&
    hasBookings &&
    !filteredAppointments.length

  return (
    <>
      <ShowingAppointmentFilters
        appointments={appointments}
        notifications={notifications}
        value={filter}
        onChange={setFilter}
      />
      {hasNotifications && (
        <ShowingDetailTabBookingsList
          title={notificationsTitle}
          rows={filteredNotifications}
          duration={duration}
          glowMode
          emptyMessage={notificationsEmptyMessage}
          hideEmptyMessage={isBothListEmpty || !!filteredAppointments.length}
        />
      )}
      {hasBookings && (
        <ShowingDetailTabBookingsList
          title={bookingsTitle}
          rows={filteredAppointments}
          duration={duration}
          emptyMessage={bookingsEmptyMessage}
        />
      )}
    </>
  )
}

export default ShowingDetailTabBookings
