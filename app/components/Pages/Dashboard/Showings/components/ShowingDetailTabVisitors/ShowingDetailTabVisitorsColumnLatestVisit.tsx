import { MouseEvent } from 'react'

import { Box } from '@material-ui/core'

import {
  getAppointmentDateLabel,
  getAppointmentTimeLabel,
  getAppointmentTitle
} from '../../helpers'
import ShowingLabeledColumn from '../ShowingLabeledColumn'
import ShowingViewFeedbackButton from '../ShowingViewFeedbackButton'

interface ShowingDetailTabVisitorsColumnLatestVisitProps {
  duration: number
  appointment: Optional<IShowingAppointment<'showing'>>
}

function ShowingDetailTabVisitorsColumnLatestVisit({
  appointment,
  duration
}: ShowingDetailTabVisitorsColumnLatestVisitProps) {
  const handleClick = (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation()
  }

  if (!appointment) {
    return null
  }

  return (
    <>
      <Box display="inline-block" mr={2}>
        <ShowingLabeledColumn label="Visit:">
          {getAppointmentDateLabel(appointment.time)}{' '}
          {getAppointmentTimeLabel(appointment.time, duration)}
        </ShowingLabeledColumn>
      </Box>
      {appointment.feedback && (
        <span onClick={handleClick}>
          <ShowingViewFeedbackButton
            feedback={appointment.feedback}
            contact={appointment.contact}
            appointmentTitle={getAppointmentTitle(appointment)}
          />
        </span>
      )}
    </>
  )
}

export default ShowingDetailTabVisitorsColumnLatestVisit
