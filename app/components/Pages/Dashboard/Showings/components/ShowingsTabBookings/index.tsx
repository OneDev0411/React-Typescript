import { Box } from '@material-ui/core'
import { withRouter, WithRouterProps } from 'react-router'

import { generateAppointmentFilterLink } from '../../helpers'

import { AppointmentFilter } from '../../types'

import ShowingAppointmentFilters from '../ShowingAppointmentFilters'

interface ShowingsTabBookingsProps extends WithRouterProps {
  isLoading: boolean
  appointments: IShowingAppointment[]
  notifications: IShowingAppointment[]
}

function ShowingsTabBookings({
  isLoading,
  appointments,
  notifications,
  location
}: ShowingsTabBookingsProps) {
  const filter: AppointmentFilter = location.query.filter || 'All'

  return (
    <Box>
      <ShowingAppointmentFilters
        appointments={appointments}
        notifications={notifications}
        generateLink={generateAppointmentFilterLink}
        value={filter}
      />
      <Box mt={6}>appointments</Box>
    </Box>
  )
}

export default withRouter(ShowingsTabBookings)
