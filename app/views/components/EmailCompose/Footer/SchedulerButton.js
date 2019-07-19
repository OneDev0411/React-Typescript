import React from 'react'

import IconButton from 'components/Button/IconButton'
import TimeIcon from 'components/SvgIcons/Time/IconTime'
import Tooltip from 'components/tooltip'

function SchedulerButton(props) {
  return (
    <Tooltip caption={props.isScheduled ? 'Edit Schedule' : 'Schedule Email'}>
      <IconButton
        data-test="compose-schedule-email"
        inverse
        rightRounded
        iconSize="large"
        appearance="primary"
        onClick={props.onOpen}
      >
        <TimeIcon />
      </IconButton>
    </Tooltip>
  )
}

export default SchedulerButton
