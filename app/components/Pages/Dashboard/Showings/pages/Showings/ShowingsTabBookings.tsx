import { Dispatch, SetStateAction } from 'react'

import ShowingFilteredBookingList, {
  ShowingFilteredBookingListProps
} from '../../components/ShowingFilteredBookingList'
import { generateAppointmentFilterLink } from '../../helpers'

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

  return (
    <ShowingFilteredBookingList
      appointments={appointments}
      hasPropertyColumn
      generateLink={generateAppointmentFilterLink}
      onApprovalAction={updateShowingsAppointmentStatus}
      stackDateAndTimeColumns
      emptyDescription="Create your first showing for your off-market or MLS listings under 2 minutes."
    />
  )
}

export default ShowingsTabBookings
