import React from 'react'

import Chip, { ChipProps } from 'views/components/Chip'

type AppointmentStatusChipProps = Pick<IAppointment, 'status'>

const statusColors: Record<IAppointmentStatus, Required<ChipProps['color']>> = {
  Approved: 'green',
  Pending: 'orange',
  Cancelled: 'red',
  Finished: 'black',
  Rescheduled: 'orange',
  NeedsRescheduling: 'black'
}

function AppointmentStatusChip({ status }: AppointmentStatusChipProps) {
  return <Chip label={status} color={statusColors[status]} />
}

export default AppointmentStatusChip
