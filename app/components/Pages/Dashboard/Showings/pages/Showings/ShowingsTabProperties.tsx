import { Box } from '@material-ui/core'

import { generateAppointmentFilterLink } from '../../helpers'

import ShowingAppointmentFilters from '../../components/ShowingAppointmentFilters'
import ShowingPropertyList from '../../components/ShowingPropertyList'

interface ShowingsTabPropertiesProps {
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
