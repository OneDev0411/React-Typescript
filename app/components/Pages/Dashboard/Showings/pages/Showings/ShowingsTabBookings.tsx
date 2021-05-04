import { Dispatch, SetStateAction } from 'react'

import ShowingNotificationBookingLists, {
  ShowingNotificationBookingListsProps
} from '../../components/ShowingNotificationBookingLists'

import { generateAppointmentFilterLink } from '../../helpers'
import useShowingsUpdateAppointmentStatus from './use-showings-update-appointment-status'

interface ShowingsTabBookingsProps
  extends Pick<
    ShowingNotificationBookingListsProps,
    'appointments' | 'notifications' | 'unseenAppointmentNotificationIds'
  > {
  setShowings: Dispatch<SetStateAction<IShowing[]>>
}

function ShowingsTabBookings({
  appointments,
  notifications,
  unseenAppointmentNotificationIds,
  setShowings
}: ShowingsTabBookingsProps) {
  const updateAppointmentStatus = useShowingsUpdateAppointmentStatus(
    setShowings
  )

  return (
    <ShowingNotificationBookingLists
      unseenAppointmentNotificationIds={unseenAppointmentNotificationIds}
      appointments={appointments}
      notifications={notifications}
      hasPropertyColumn
      generateLink={generateAppointmentFilterLink}
      onApprovalAction={updateAppointmentStatus}
    />
  )
}

export default ShowingsTabBookings
