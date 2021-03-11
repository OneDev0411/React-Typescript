import React from 'react'
import moment from 'moment'
import { Avatar, Box, Card, makeStyles } from '@material-ui/core'
import { AccountCircleOutlined as AccountCircleOutlinedIcon } from '@material-ui/icons'

import AppointmentStatusChip from '../AppointmentStatusChip'

import AppointmentCardDate from './AppointmentCardDate'
import AppointmentCardTimeSlot from './AppointmentCardTimeSlot'
import AppointmentCardDetail from './AppointmentCardDetail'
import AppointmentCardButton from './AppointmentCardButton'

const useStyles = makeStyles(
  theme => ({
    date: { color: theme.palette.grey[500] },
    image: {
      width: theme.spacing(7),
      height: theme.spacing(7)
    },
    icon: { fontSize: theme.spacing(2) },
    detail: { marginBottom: theme.spacing(1) }
  }),
  { name: 'AppointmentCard' }
)

export interface AppointmentCardProps
  extends Omit<IAppointment, 'time'>,
    Pick<IShowing, 'duration'> {
  className?: string
  time: moment.Moment
  image: string
}

function AppointmentCard({
  className,
  time,
  duration,
  status,
  image
}: AppointmentCardProps) {
  const classes = useStyles()

  return (
    <Card variant="outlined" className={className}>
      <Box padding={2}>
        <Box display="flex" mb={2}>
          <Box flexShrink="0" mr={2}>
            <Avatar className={classes.image} src={image} />
          </Box>
          <Box>
            <AppointmentCardDate className={classes.date} time={time} />
            <AppointmentCardTimeSlot time={time} duration={duration} />
            <AppointmentStatusChip status={status} />
          </Box>
        </Box>
        <AppointmentCardDetail
          className={classes.detail}
          icon={<AccountCircleOutlinedIcon className={classes.icon} />}
          title="Philip Grant"
          subtitle="1187 Cuza Glen 348 Ajudis Turnpike"
        />
        <AppointmentCardDetail
          className={classes.detail}
          icon={<AccountCircleOutlinedIcon className={classes.icon} />}
          title="Troy Franklin"
          subtitle="348 Ajudis Turnpike 1187 Cuza Glen"
        />
        <Box mt={2} height={32}>
          <AppointmentCardButton status={status} />
        </Box>
      </Box>
    </Card>
  )
}

export default AppointmentCard
