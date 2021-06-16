import {
  Popper,
  Paper,
  PopperProps,
  makeStyles,
  Typography,
  Box
} from '@material-ui/core'

import { getAppointmentTimeLabel, getAppointmentDateLabel } from '../../helpers'

const useStyles = makeStyles(
  theme => ({
    root: { width: theme.spacing(66) },
    date: { width: theme.spacing(13) }
  }),
  { name: 'ShowingDetailTabVisitorsAppointmentHistory' }
)

export interface ShowingDetailTabVisitorsAppointmentHistoryProps
  extends Omit<PopperProps, 'children'> {
  duration: IShowing['duration']
  appointments: IShowingAppointment[]
}

function ShowingDetailTabVisitorsAppointmentHistory({
  duration,
  appointments,
  ...otherProps
}: ShowingDetailTabVisitorsAppointmentHistoryProps) {
  const classes = useStyles()

  return (
    <Popper {...otherProps}>
      <Paper className={classes.root}>
        {appointments.map(appointment => (
          <Box key={appointment.id} p={2} mt={0.5}>
            <Typography variant="body2" component="div">
              <Box display="inline-block" className={classes.date}>
                {getAppointmentDateLabel(appointment.time)}
              </Box>
              {getAppointmentTimeLabel(appointment.time, duration)}
            </Typography>
          </Box>
        ))}
      </Paper>
    </Popper>
  )
}

export default ShowingDetailTabVisitorsAppointmentHistory
