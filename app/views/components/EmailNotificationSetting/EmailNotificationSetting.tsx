import React from 'react'

import LabeledSwitch, { LabeledSwitchProps } from 'components/LabeledSwitch'

type Props = Omit<LabeledSwitchProps, 'children'>

export default function EmailNotificationSetting(props: Props) {
  return <LabeledSwitch {...props}>Notify when opened or clicked</LabeledSwitch>
}
