import React from 'react'

import LabeledSwitchInput, {
  LabeledSwitchInputProps
} from 'components/LabeledSwitchInput/LabeledSwitchInput'

interface Props extends Omit<LabeledSwitchInputProps, 'children'> {}

export default function EmailNotificationSetting(props: Props) {
  return (
    <LabeledSwitchInput {...props}>
      Notify when opened or clicked
    </LabeledSwitchInput>
  )
}
