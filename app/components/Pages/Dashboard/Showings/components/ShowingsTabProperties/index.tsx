import { Box } from '@material-ui/core'

import ShowingAppointmentFilters from '../ShowingAppointmentFilters'
import useAppointmentNotificationLists from '../use-appointment-notification-lists'

import ShowingPropertyList from '../ShowingPropertyList'

interface ShowingsTabPropertiesProps {
  isLoading: boolean
  showings: IShowing[]
  appointments: IShowingAppointment[]
}

function ShowingsTabProperties({
  appointments: allAppointments,
  ...otherProps
}: ShowingsTabPropertiesProps) {
  const { appointments, notifications } = useAppointmentNotificationLists(
    allAppointments
  )

  return (
    <Box mt={4}>
      <ShowingAppointmentFilters
        appointments={appointments}
        notifications={notifications}
      />
      <Box mt={6}>
        <ShowingPropertyList {...otherProps} />
      </Box>
    </Box>
  )
}

export default ShowingsTabProperties
