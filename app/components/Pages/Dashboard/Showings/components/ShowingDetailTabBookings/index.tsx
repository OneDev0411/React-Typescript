import { Grid } from '@material-ui/core'

import BoxWithTitle from '../BoxWithTitle'
import ShowingAppointmentCard from '../ShowingAppointmentCard'

import useCreateDateBuckets from './use-create-date-buckets'

interface ShowingDetailTabBookingsProps {
  appointments?: IShowingAppointment[]
}

function ShowingDetailTabBookings({
  appointments
}: ShowingDetailTabBookingsProps) {
  const buckets = useCreateDateBuckets(appointments ?? [])

  return (
    <>
      {buckets.map(bucket => (
        <BoxWithTitle key={bucket.label} title={bucket.label}>
          <Grid container spacing={1}>
            {bucket.appointments.map((appointment, idx) => (
              <Grid item key={idx} xs={3}>
                <ShowingAppointmentCard appointment={appointment} hideImage />
              </Grid>
            ))}
          </Grid>
        </BoxWithTitle>
      ))}
    </>
  )
}

export default ShowingDetailTabBookings
