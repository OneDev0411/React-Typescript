import React from 'react'
import { Typography } from '@material-ui/core'
import moment from 'moment'

interface AppointmentCardDateProps {
  className?: string
  time: moment.Moment
}

function AppointmentCardDate({ className, time }: AppointmentCardDateProps) {
  return (
    <Typography className={className} variant="caption" display="block">
      {time.format('dddd, MMMM DD, YYYY')}
    </Typography>
  )
}

export default AppointmentCardDate
