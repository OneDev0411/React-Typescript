import { Dispatch, SetStateAction } from 'react'

import ShowingNotificationBookingLists, {
  ShowingNotificationBookingListsProps
} from '../../components/ShowingNotificationBookingLists'

import { generateAppointmentFilterLink } from '../../helpers'
import useAppointmentNotificationLists from '../../hooks/use-appointment-notification-lists'
import { ApprovalActionParams } from '../../types'
import useShowingsAckAppointmentNotifications from './use-showings-ack-appointment-notifications'
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

  const ackAppointmentNotifications = useShowingsAckAppointmentNotifications(
    setShowings
  )

  const handleApprovalAction = (params: ApprovalActionParams) => {
    updateAppointmentStatus(params)
    ackAppointmentNotifications(params)
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
