import { Grid } from '@material-ui/core'

import ShowingAppointmentCardStack from '../ShowingAppointmentCardStack'

function ShowingAppointmentUpdates() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <ShowingAppointmentCardStack title="Card Stack 1" />
      </Grid>
      <Grid item xs={3}>
        <ShowingAppointmentCardStack title="Card Stack 2" />
      </Grid>
      <Grid item xs={3}>
        <ShowingAppointmentCardStack title="Card Stack 3" />
      </Grid>
      <Grid item xs={3}>
        <ShowingAppointmentCardStack title="Card Stack 4" />
      </Grid>
    </Grid>
  )
}

export default ShowingAppointmentUpdates
