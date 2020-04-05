import React from 'react'
import { Tooltip } from '@material-ui/core'

import IconButton from 'components/Button/IconButton'
import TimeIcon from 'components/SvgIcons/Time/IconTime'

function SchedulerButton(props) {
  return (
    <Tooltip title={props.isScheduled ? 'Edit Schedule' : 'Schedule Email'}>
      <IconButton
        data-test="compose-schedule-email"
        inverse
        rightRounded
        iconSize="large"
        appearance="secondary"
        onClick={props.onOpen}
      >
        <TimeIcon />
      </IconButton>
    </Tooltip>
  )
}

export default SchedulerButton
