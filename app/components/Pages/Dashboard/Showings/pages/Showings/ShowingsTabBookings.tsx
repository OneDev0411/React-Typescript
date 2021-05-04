import { Dispatch, SetStateAction } from 'react'

import ShowingNotificationBookingLists, {
  ShowingNotificationBookingListsProps
} from '../../components/ShowingNotificationBookingLists'

import { generateAppointmentFilterLink } from '../../helpers'
import { ApprovalActionParams } from '../../types'
import useShowingsMarkAppointmentNotificationsAsSeen from './use-showings-mark-appointment-notifications-as-seen'
import useShowingsUpdateAppointmentStatus from './use-showings-update-appointment-status'

interface ShowingsTabBookingsProps
  extends Pick<
    ShowingNotificationBookingListsProps,
    'appointments' | 'notifications'
  > {
  setShowings: Dispatch<SetStateAction<IShowing[]>>
}

function ShowingsTabBookings({
  appointments,
  notifications,
  setShowings
}: ShowingsTabBookingsProps) {
  const updateAppointmentStatus = useShowingsUpdateAppointmentStatus(
    setShowings
  )

  const markAppointmentNotificationsAsSeen = useShowingsMarkAppointmentNotificationsAsSeen(
    setShowings
  )

  const handleApprovalAction = (params: ApprovalActionParams) => {
    updateAppointmentStatus(params)
    markAppointmentNotificationsAsSeen(params)
  }

  return (
    <ShowingNotificationBookingLists
      appointments={appointments}
      notifications={notifications}
      hasPropertyColumn
      generateLink={generateAppointmentFilterLink}
      onApprovalAction={handleApprovalAction}
    />
  )
}

export default ShowingsTabBookings
