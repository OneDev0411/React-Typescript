import { Dispatch, SetStateAction } from 'react'

import ShowingFilteredBookingList, {
  ShowingFilteredBookingListProps
} from '../../components/ShowingFilteredBookingList'
import { generateAppointmentFilterLink } from '../../helpers'

import useShowingsAckAppointmentNotification from './use-showings-ack-appointment-notification'
import useShowingsDismissAppointmentNotifications from './use-showings-dismiss-appointment-notifications'
import useShowingsUpdateAppointmentStatus from './use-showings-update-appointment-status'

interface ShowingsTabBookingsProps
  extends Pick<ShowingFilteredBookingListProps, 'appointments'> {
  setShowings: Dispatch<SetStateAction<IShowing<'showing'>[]>>
}

function ShowingsTabBookings({
  appointments,
  setShowings
}: ShowingsTabBookingsProps) {
  const updateShowingsAppointmentStatus =
    useShowingsUpdateAppointmentStatus(setShowings)

  const dismissShowingsAppointmentNotifications =
    useShowingsDismissAppointmentNotifications(setShowings)

  const ackShowingsAppointmentNotifications =
    useShowingsAckAppointmentNotification(setShowings)

  return (
    <ShowingFilteredBookingList
      appointments={appointments}
      hasPropertyColumn
      generateLink={generateAppointmentFilterLink}
      onApprovalAction={updateShowingsAppointmentStatus}
      onDismissAction={dismissShowingsAppointmentNotifications}
      onAckAction={ackShowingsAppointmentNotifications}
      stackDateAndTimeColumns
      // eslint-disable-next-line max-len
      emptyDescription="Create your first showing for your off-market or MLS listings under 2 minutes."
    />
  )
}

export default ShowingsTabBookings
