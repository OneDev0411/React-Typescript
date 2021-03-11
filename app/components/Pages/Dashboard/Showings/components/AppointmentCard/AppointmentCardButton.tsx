import React from 'react'

import SplitButton from 'components/SplitButton'

import AppointmentCardButtonMenu from './AppointmentCardButtonMenu'

interface AppointmentCardButtonProps {
  status: IAppointmentStatus
}

const buttonLabels: Record<IAppointmentStatus, string> = {
  Approved: 'Reschedule',
  Finished: 'Request Feedback',
  Pending: 'Approve',
  Cancelled: '',
  Rescheduled: ''
}

function AppointmentCardButton({ status }: AppointmentCardButtonProps) {
  if (!buttonLabels[status]) {
    return null
  }

  const handleClick = () => {
    // TODO: implement this logic
    console.log('AppointmentCardButton::click')
  }

  return (
    <SplitButton
      size="small"
      onClick={handleClick}
      RenderMenu={AppointmentCardButtonMenu}
    >
      {buttonLabels[status]}
    </SplitButton>
  )
}

export default AppointmentCardButton
