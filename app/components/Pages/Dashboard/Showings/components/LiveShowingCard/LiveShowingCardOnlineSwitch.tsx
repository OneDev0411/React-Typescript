import React from 'react'

import { Tooltip } from '@material-ui/core'

import LabeledSwitch from 'components/LabeledSwitch'

function LiveShowingCardOnlineSwitch() {
  return (
    <Tooltip title="Remove all availability">
      <LabeledSwitch SwitchProps={{ color: 'primary' }} labelMargin={1}>
        Online
      </LabeledSwitch>
    </Tooltip>
  )
}

export default LiveShowingCardOnlineSwitch
