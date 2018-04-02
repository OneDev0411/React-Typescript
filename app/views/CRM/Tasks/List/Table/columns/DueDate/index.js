import React from 'react'
import styled from 'styled-components'
import fecha from 'fecha'

import TimeIcon from '../../../../../../components/SvgIcons/Time/IconTime'
import FlexContainer from '../../../../../../components/FlexContainer'

const DueDate = styled.span`
  position: relative;
  line-height: 1;
  color: ${props => (!props.done && props.expired ? 'red' : '#1d364b')};
`

const Reminder = styled.span`
  line-height: 1;
  margin-left: 1em;
`

const formatDate = date => fecha.format(date * 1000, 'M/DD/YYYY hh:mm A')

export function DueDateCell({ task }) {
  const { due_date, reminders, status } = task
  const done = status === 'DONE'
  const expired = due_date * 1000 - new Date().getTime() < 0
  const formatedDueDate = formatDate(due_date)
  const hasReminder = Array.isArray(reminders) && reminders.length > 0

  let formatedLatestReminder = ''

  if (hasReminder) {
    const latestReminder = reminders[reminders.length - 1].timestamp

    formatedLatestReminder = formatDate(latestReminder)
  }

  return (
    <FlexContainer>
      <DueDate expired={expired} done={done}>
        {formatedDueDate}
      </DueDate>
      {hasReminder && (
        <Reminder title={`Reminder: ${formatedLatestReminder}`}>
          <TimeIcon style={{ width: 16, height: 16 }} />
        </Reminder>
      )}
    </FlexContainer>
  )
}
