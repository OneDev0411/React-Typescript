import React from 'react'
import { Grid } from '@material-ui/core'

import moment from 'moment'

import AppointmentCard, { AppointmentCardProps } from '../AppointmentCard'

const appointment: Partial<AppointmentCardProps> = {
  time: moment('2022-04-03'),
  duration: 60
}

const allStatuses: IAppointmentStatus[] = [
  'Approved',
  'Cancelled',
  'Pending',
  'Finished'
]

function AppointmentList() {
  return (
    <Grid container spacing={2}>
      {allStatuses.map((status, idx) => (
        <Grid item xs={3} key={idx}>
          <AppointmentCard
            {...(appointment as AppointmentCardProps)}
            image={`https://picsum.photos/id/${100 + idx}/56/56`}
            status={status}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default AppointmentList
