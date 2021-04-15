import classNames from 'classnames'
import { Box, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    root: {
      height: theme.spacing(4),
      padding: theme.spacing(0, 2),
      ...theme.typography.overline
    },
    pending: {
      backgroundColor: theme.palette.warning.dark,
      color: theme.palette.warning.ultralight
    },
    approved: {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.success.ultralight
    },
    cancelled: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.success.ultralight
    },
    finished: {
      backgroundColor: theme.palette.info.main,
      color: theme.palette.success.ultralight
    }
  }),
  { name: 'ShowingAppointmentCardStatus' }
)

const labels: Record<IAppointmentStatus, string> = {
  Pending: 'Waiting for Confirmation',
  Approved: 'Approved',
  NeedsRescheduling: '',
  Rescheduled: '',
  Cancelled: 'Cancelled',
  Finished: 'Finished'
}

interface ShowingAppointmentCardStatusProps {
  status: IAppointmentStatus
}

function ShowingAppointmentCardStatus({
  status
}: ShowingAppointmentCardStatusProps) {
  const classes = useStyles()

  return (
    <Box
      className={classNames(classes.root, classes[status.toLowerCase()])}
      display="flex"
      alignItems="center"
    >
      {labels[status]}
    </Box>
  )
}

export default ShowingAppointmentCardStatus
