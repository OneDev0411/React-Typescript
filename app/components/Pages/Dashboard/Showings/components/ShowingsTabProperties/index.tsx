import { Box } from '@material-ui/core'

import { generateAppointmentFilterLink } from '../../helpers'

import ShowingAppointmentFilters from '../ShowingAppointmentFilters'

import ShowingPropertyList from '../ShowingPropertyList'

interface ShowingsTabPropertiesProps {
  isLoading: boolean
  showings: IShowing[]
  appointments: IShowingAppointment[]
  notifications: IShowingAppointment[]
}

function ShowingsTabProperties({
  appointments,
  notifications,
  ...otherProps
}: ShowingsTabPropertiesProps) {
  return (
    <Box>
      <ShowingAppointmentFilters
        appointments={appointments}
        notifications={notifications}
        generateLink={generateAppointmentFilterLink}
      />
      <Box mt={6}>
        <ShowingPropertyList {...otherProps} />
      </Box>
    </Box>
  )
}

export default ShowingsTabProperties
