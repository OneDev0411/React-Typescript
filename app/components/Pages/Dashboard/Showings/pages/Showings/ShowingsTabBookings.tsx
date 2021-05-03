import { Dispatch, SetStateAction } from 'react'
import { Box } from '@material-ui/core'

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
  isLoading: boolean
  setShowings: Dispatch<SetStateAction<IShowing[]>>
}

function ShowingsTabBookings({
  isLoading,
  appointments,
  notifications,
  unseenAppointmentNotificationIds,
  setShowings
}: ShowingsTabBookingsProps) {
  const updateAppointmentStatus = useShowingsUpdateAppointmentStatus(
    setShowings
  )

  return (
    <Box>
      <ShowingNotificationBookingLists
        unseenAppointmentNotificationIds={unseenAppointmentNotificationIds}
        appointments={appointments}
        notifications={notifications}
        hasPropertyColumn
        generateLink={generateAppointmentFilterLink}
        onApprovalAction={updateAppointmentStatus}
      />
    </Box>
  )
}

export default ShowingsTabBookings
