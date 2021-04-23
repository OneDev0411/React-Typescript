import { Box, Typography, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import FeedbackStars from '../FeedbackStars'

import useAppointmentStatusIconLabel from './use-appointment-status-icon-label'

const useStyles = makeStyles(
  theme => ({
    root: { '& > svg': { fontSize: theme.spacing(2) } },
    label: { marginLeft: theme.spacing(1) },
    requested: { color: theme.palette.warning.dark },
    confirmed: { color: theme.palette.success.dark },
    rescheduled: { color: theme.palette.warning.dark },
    canceled: { color: theme.palette.grey[500] },
    completed: { color: theme.palette.warning.dark },
    stars: { marginLeft: theme.spacing(0.5) }
  }),
  { name: 'ShowingDetailTabBookingsListColumnStatus' }
)

interface ShowingDetailTabBookingsListColumnStatusProps {
  status: IAppointmentStatus
  feedbackRate?: number
}

function ShowingDetailTabBookingsListColumnStatus({
  status,
  feedbackRate
}: ShowingDetailTabBookingsListColumnStatusProps) {
  const classes = useStyles()
  const { icon, label } = useAppointmentStatusIconLabel(status)

  return (
    <Box
      className={classNames(classes.root, classes[status.toLowerCase()])}
      display="flex"
      alignItems="center"
    >
      {status !== 'Completed' || !feedbackRate ? (
        <>
          {icon}
          <Typography
            className={classes.label}
            variant="body2"
            component="span"
          >
            {label}
          </Typography>
        </>
      ) : (
        <>
          <Typography
            className={classes.label}
            variant="body2"
            component="span"
          >
            {label}:
          </Typography>
          <FeedbackStars className={classes.stars} value={feedbackRate} />
        </>
      )}
    </Box>
  )
}

export default ShowingDetailTabBookingsListColumnStatus
