import { Box, Typography, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import useAppointmentFilterInfo from '../../hooks/use-appointment-filter-info'

const useStyles = makeStyles(
  theme => ({
    root: { '& > svg': { fontSize: theme.spacing(2) } },
    label: { marginLeft: theme.spacing(1) },
    requested: { color: theme.palette.warning.dark },
    confirmed: { color: theme.palette.success.dark },
    rescheduled: { color: theme.palette.warning.dark },
    canceled: { color: theme.palette.grey[500] },
    completed: { color: theme.palette.grey[600] }
  }),
  { name: 'ShowingBookingListColumnStatus' }
)

interface ShowingBookingListColumnStatusProps {
  status: IShowingAppointmentStatus
}

function ShowingBookingListColumnStatus({
  status
}: ShowingBookingListColumnStatusProps) {
  const classes = useStyles()
  const { filledIcon, icon, label } = useAppointmentFilterInfo(status)

  return (
    <Box
      className={classNames(classes.root, classes[status.toLowerCase()])}
      display="flex"
      alignItems="center"
    >
      {filledIcon || icon}
      <Typography className={classes.label} variant="body2" component="span">
        {label}
      </Typography>
    </Box>
  )
}

export default ShowingBookingListColumnStatus
