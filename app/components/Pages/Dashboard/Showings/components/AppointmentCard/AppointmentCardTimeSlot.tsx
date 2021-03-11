import React from 'react'
import moment from 'moment'
import { Typography } from '@material-ui/core'

interface AppointmentCardTimeSlotProps {
  time: moment.Moment
  duration: number
}

function AppointmentCardTimeSlot({
  time,
  duration
}: AppointmentCardTimeSlotProps) {
  return (
    <Typography variant="subtitle1" display="block">
      {time.format('LT')} - {time.add(duration, 'seconds').format('LT')}
    </Typography>
  )
}

export default AppointmentCardTimeSlot
