import { Grid } from '@material-ui/core'

import ShowingAppointmentCardStack from '../ShowingAppointmentCardStack'

function ShowingAppointmentUpdates() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <ShowingAppointmentCardStack title="Needs Confirmation (7)" />
      </Grid>
      <Grid item xs={3}>
        <ShowingAppointmentCardStack title="Upcoming Booking (12)" />
      </Grid>
      <Grid item xs={3}>
        <ShowingAppointmentCardStack title="Canceled (3)" />
      </Grid>
      <Grid item xs={3} />
    </Grid>
  )
}

export default ShowingAppointmentUpdates
