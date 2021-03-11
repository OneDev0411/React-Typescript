import React from 'react'

import LabeledSwitch, { LabeledSwitchProps } from 'components/LabeledSwitch'

const switchProps: LabeledSwitchProps['SwitchProps'] = {
  color: 'primary',
  tooltip: 'Remove all availability'
}

function LiveShowingCardOnlineSwitch() {
  return (
    <LabeledSwitch SwitchProps={switchProps} labelMargin={1}>
      Online
    </LabeledSwitch>
  )
}

export default LiveShowingCardOnlineSwitch
