import { Dispatch, SetStateAction } from 'react'

import ShowingNotificationBookingLists, {
  ShowingNotificationBookingListsProps
} from '../../components/ShowingNotificationBookingLists'

import { generateAppointmentFilterLink } from '../../helpers'
import useAppointmentNotificationLists from '../../hooks/use-appointment-notification-lists'
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

  const updateShowingsAppointmentStatus = useShowingsUpdateAppointmentStatus(
    setShowings
  )

  const dismissShowingsAppointmentNotifications = useShowingsDismissAppointmentNotifications(
    setShowings
  )

  return (
    <ShowingNotificationBookingLists
      appointments={appointments}
      notifications={notifications}
      hasPropertyColumn
      generateLink={generateAppointmentFilterLink}
      onApprovalAction={updateShowingsAppointmentStatus}
      onDismissAction={dismissShowingsAppointmentNotifications}
    />
  )
}

export default ShowingsTabBookings
