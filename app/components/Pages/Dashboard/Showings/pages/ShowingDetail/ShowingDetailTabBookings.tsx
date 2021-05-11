import { Dispatch, SetStateAction } from 'react'

import { Location } from 'history'

import useSortAppointments from '../../hooks/use-sort-appointments'
import useAppointmentNotificationLists from '../../hooks/use-appointment-notification-lists'

import ShowingNotificationBookingLists from '../../components/ShowingNotificationBookingLists'
import { AppointmentFilter, ApprovalActionParams } from '../../types'
import useShowingUpdateAppointmentStatus from './use-showing-update-appointment-status'
import useShowingDismissAppointmentNotifications from './use-showing-dismiss-appointment-notifications'

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

  const { appointments, notifications } = useAppointmentNotificationLists(
    sortedAppointments
  )

  const updateShowingAppointmentStatus = useShowingUpdateAppointmentStatus(
    setShowing
  )

  const dismissShowingAppointmentNotifications = useShowingDismissAppointmentNotifications(
    setShowing
  )

  const handleApprovalAction = (params: ApprovalActionParams) => {
    updateShowingAppointmentStatus(params)
    dismissShowingAppointmentNotifications(params)
  }

  return (
    <ShowingNotificationBookingLists
      appointments={appointments}
      notifications={notifications}
      onApprovalAction={handleApprovalAction}
      generateLink={generateAppointmentFilterLink}
      onDismissAction={dismissShowingAppointmentNotifications}
    />
  )
}

export default ShowingDetailTabBookings
