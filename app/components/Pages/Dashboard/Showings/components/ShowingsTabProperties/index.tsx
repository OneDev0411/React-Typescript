import { Box } from '@material-ui/core'

import ShowingPropertyList from '../ShowingPropertyList'
import ShowingAppointmentUpdates from '../ShowingAppointmentUpdates'

function ShowingsTabProperties() {
  return (
    <>
      <Box mb={5}>
        <ShowingAppointmentUpdates />
      </Box>
      <ShowingPropertyList />
    </>
  )
}

export default ShowingsTabProperties
