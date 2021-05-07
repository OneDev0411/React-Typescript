import { Dispatch, SetStateAction } from 'react'

import ShowingNotificationBookingLists, {
  ShowingNotificationBookingListsProps
} from '../../components/ShowingNotificationBookingLists'

import { generateAppointmentFilterLink } from '../../helpers'
import useAppointmentNotificationLists from '../../hooks/use-appointment-notification-lists'
import { ApprovalActionParams } from '../../types'
import useShowingsDismissAppointmentNotifications from './use-showings-dismiss-appointment-notifications'
import useShowingsUpdateAppointmentStatus from './use-showings-update-appointment-status'

interface ShowingsTabBookingsProps
  extends Pick<ShowingNotificationBookingListsProps, 'appointments'> {
  setShowings: Dispatch<SetStateAction<IShowing[]>>
}

function ShowingsTabBookings({
  appointments: allAppointments,
  setShowings
}: ShowingsTabBookingsProps) {
  const { appointments, notifications } = useAppointmentNotificationLists(
    allAppointments
  )

  const updateAppointmentStatus = useShowingsUpdateAppointmentStatus(
    setShowings
  )

  const dismissAppointmentNotifications = useShowingsDismissAppointmentNotifications(
    setShowings
  )

  const handleApprovalAction = (params: ApprovalActionParams) => {
    updateAppointmentStatus(params)
    dismissAppointmentNotifications(params)
  }

  return (
    <ShowingNotificationBookingLists
      appointments={appointments}
      notifications={notifications}
      hasPropertyColumn
      generateLink={generateAppointmentFilterLink}
      onApprovalAction={handleApprovalAction}
      onDismissAction={dismissAppointmentNotifications}
    />
  )
}

export default ShowingsTabBookings
