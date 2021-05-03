import { Dispatch, SetStateAction } from 'react'

import { Location } from 'history'

import useSortAppointments from '../../hooks/use-sort-appointments'
import useAppointmentNotificationLists from '../../hooks/use-appointment-notification-lists'

import useUpdateAppointmentStatus from './use-update-appointment-status'
import ShowingNotificationBookingLists from '../ShowingNotificationBookingLists'
import { AppointmentFilter } from '../../types'

const generateAppointmentFilterLink = (
  filter: AppointmentFilter,
  location: Location
) => `${location.pathname}?filter=${filter}`

interface ShowingDetailTabBookingsProps {
  appointments: IShowingAppointment[]
  setShowing: Dispatch<SetStateAction<IShowing>>
}

function ShowingDetailTabBookings({
  appointments: allAppointments,
  setShowing
}: ShowingDetailTabBookingsProps) {
  const sortedAppointments = useSortAppointments(allAppointments)

  const {
    appointments,
    notifications,
    unseenAppointmentNotificationIds
  } = useAppointmentNotificationLists(sortedAppointments)

  const updateAppointmentStatus = useUpdateAppointmentStatus(setShowing)

  return (
    <ShowingNotificationBookingLists
      unseenAppointmentNotificationIds={unseenAppointmentNotificationIds}
      appointments={appointments}
      notifications={notifications}
      onApprovalAction={updateAppointmentStatus}
      generateLink={generateAppointmentFilterLink}
    />
  )
}

export default ShowingDetailTabBookings
