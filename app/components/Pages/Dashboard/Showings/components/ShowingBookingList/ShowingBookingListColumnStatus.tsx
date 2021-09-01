import { Box, Typography, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import useAppointmentFilterInfo from '../../hooks/use-appointment-filter-info'

const useStyles = makeStyles(
  theme => ({
    root: {
      height: theme.spacing(3),
      padding: theme.spacing(0, 0.5),
      borderRadius: theme.spacing(1.5)
    },
    label: { marginLeft: theme.spacing(0.5) },
    requested: {
      color: theme.palette.warning.dark,
      backgroundColor: theme.palette.warning.ultralight
    },
    confirmed: {
      color: theme.palette.success.dark,
      backgroundColor: theme.palette.success.ultralight
    },
    rescheduled: {
      color: theme.palette.warning.dark,
      backgroundColor: theme.palette.warning.ultralight
    },
    canceled: {
      color: theme.palette.grey[600],
      backgroundColor: theme.palette.grey[200]
    },
    completed: {
      color: theme.palette.grey[600],
      backgroundColor: theme.palette.grey[200]
    }
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
  const { icon, label } = useAppointmentFilterInfo(status)

  return (
    <Box
      className={classNames(classes.root, classes[status.toLowerCase()])}
      display="inline-flex"
      alignItems="center"
    >
      {icon && <SvgIcon path={icon} size={muiIconSizes.small} />}
      <Typography className={classes.label} variant="body2" component="span">
        {label}
      </Typography>
    </Box>
  )
}

export default ShowingBookingListColumnStatus
