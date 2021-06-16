import { Box } from '@material-ui/core'
import { MouseEvent } from 'react'

import { getAppointmentDateLabel, getAppointmentTimeLabel } from '../../helpers'
import ShowingLabeledColumn from '../ShowingLabeledColumn'

import ShowingViewFeedbackButton from '../ShowingViewFeedbackButton'

interface ShowingDetailTabVisitorsColumnLastVisitProps {
  duration: number
  appointment: Optional<IShowingAppointment>
}

function ShowingDetailTabVisitorsColumnLastVisit({
  appointment,
  duration
}: ShowingDetailTabVisitorsColumnLastVisitProps) {
  const handleClick = (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation()
  }

  if (!appointment) {
    return null
  }

  return (
    <>
      <Box display="inline-block" mr={2}>
        <ShowingLabeledColumn label="Last Visit:">
          {getAppointmentDateLabel(appointment.time)}{' '}
          {getAppointmentTimeLabel(appointment.time, duration)}
        </ShowingLabeledColumn>
      </Box>
      {appointment.feedback && (
        <span onClick={handleClick}>
          <ShowingViewFeedbackButton
            feedback={appointment.feedback}
            contact={appointment.contact}
          />
        </span>
      )}
    </>
  )
}

export default ShowingDetailTabVisitorsColumnLastVisit
