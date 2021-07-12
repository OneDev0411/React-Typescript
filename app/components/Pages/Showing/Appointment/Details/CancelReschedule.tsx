import { Grid, Box, Button } from '@material-ui/core'

import Link from 'components/ALink'

interface Props {
  appointment: IPublicShowingAppointment<'showing'>
}

export default function ShowingAppointmentCancelReschedule({
  appointment
}: Props) {
  return (
    <Box mt={5}>
      <Grid container spacing={1}>
        <Grid item>
          <Button variant="outlined">
            <Link
              noStyle
              to={`/showings/appointments/${appointment.cancel_token}/cancel`}
            >
              Cancel
            </Link>
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined">
            <Link
              noStyle
              to={`/showings/appointments/${appointment.cancel_token}/reschedule`}
            >
              {appointment.status === 'Rescheduled'
                ? 'Reschedule Again'
                : 'Reschedule'}
            </Link>
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}
