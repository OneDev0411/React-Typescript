import { Dispatch, SetStateAction } from 'react'

import ShowingFilteredBookingList, {
  ShowingFilteredBookingListProps
} from '../../components/ShowingFilteredBookingList'

import { generateAppointmentFilterLink } from '../../helpers'
import useShowingsDismissAppointmentNotifications from './use-showings-dismiss-appointment-notifications'
import useShowingsUpdateAppointmentStatus from './use-showings-update-appointment-status'

interface ShowingsTabBookingsProps
  extends Pick<ShowingFilteredBookingListProps, 'appointments'> {
  setShowings: Dispatch<SetStateAction<IShowing[]>>
}

function ShowingsTabBookings({
  appointments,
  setShowings
}: ShowingsTabBookingsProps) {
  const updateShowingsAppointmentStatus = useShowingsUpdateAppointmentStatus(
    setShowings
  )

  const dismissShowingsAppointmentNotifications = useShowingsDismissAppointmentNotifications(
    setShowings
  )

  return (
    <ShowingFilteredBookingList
      appointments={appointments}
      hasPropertyColumn
      generateLink={generateAppointmentFilterLink}
      onApprovalAction={updateShowingsAppointmentStatus}
      onDismissAction={dismissShowingsAppointmentNotifications}
    />
  )
}

export default ShowingsTabBookings
