import React from 'react'
import { Box, Typography } from '@material-ui/core'

import AppointmentList from '../AppointmentList'

interface AppointmentListWithTitleProps {
  title: string
}

function AppointmentListWithTitle({ title }: AppointmentListWithTitleProps) {
  return (
    <Box mb={8}>
      <Box mb={2}>
        <Typography variant="h5">{title}</Typography>
      </Box>
      <AppointmentList />
    </Box>
  )
}

export default AppointmentListWithTitle
