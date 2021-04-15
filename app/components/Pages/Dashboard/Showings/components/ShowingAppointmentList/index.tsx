import React from 'react'
import { Grid } from '@material-ui/core'

import ShowingAppointmentCard from '../ShowingAppointmentCard'

// const appointment: Partial<ShowingAppointmentCardProps> = {
//   time: moment('2022-04-03'),
//   duration: 60
// }

const sampleAppointment: Partial<IShowingAppointment> = {}

function ShowingAppointmentList() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <ShowingAppointmentCard
          appointment={
            { ...sampleAppointment, status: 'Pending' } as IShowingAppointment
          }
        />
      </Grid>
      <Grid item xs={3}>
        <ShowingAppointmentCard
          appointment={
            { ...sampleAppointment, status: 'Pending' } as IShowingAppointment
          }
        />
      </Grid>
      <Grid item xs={3}>
        <ShowingAppointmentCard
          appointment={
            { ...sampleAppointment, status: 'Approved' } as IShowingAppointment
          }
        />
      </Grid>
      <Grid item xs={3}>
        <ShowingAppointmentCard
          appointment={
            { ...sampleAppointment, status: 'Cancelled' } as IShowingAppointment
          }
        />
      </Grid>
      <Grid item xs={3}>
        <ShowingAppointmentCard
          appointment={
            { ...sampleAppointment, status: 'Finished' } as IShowingAppointment
          }
        />
      </Grid>
      {/* <Grid item xs={3}>
        <ShowingAppointmentCard
          appointment={
            { ...sampleAppointment, status: 'Finished' } as IShowingAppointment
          }
        />
      </Grid> */}
    </Grid>
  )
}

export default ShowingAppointmentList
