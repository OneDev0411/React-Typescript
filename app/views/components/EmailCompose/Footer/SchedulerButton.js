import React from 'react'

import IconButton from 'components/Button/IconButton'
import TimeIcon from 'components/SvgIcons/Time/IconTime'
import Tooltip from 'components/tooltip'

function SchedulerButton(props) {
  return (
    <Tooltip caption={props.isScheduled ? 'Edit Schedule' : 'Schedule Email'}>
      <IconButton
        inverse
        appearance="primary"
        onClick={props.onOpen}
        rightRounded
      >
        <TimeIcon />
      </IconButton>
    </Tooltip>
  )
}

export default SchedulerButton
