import React from 'react'
import { Tooltip } from '@material-ui/core'

import { mdiClockOutline } from '@mdi/js'

import IconButton from 'components/Button/IconButton'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

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
        <SvgIcon path={mdiClockOutline} />
      </IconButton>
    </Tooltip>
  )
}

export default SchedulerButton
