import React from 'react'

import LabeledSwitchInput, {
  LabeledSwitchInputProps
} from 'components/LabeledSwitchInput/LabeledSwitchInput'

interface Props extends Omit<LabeledSwitchInputProps, 'label'> {}

export default function EmailNotificationSetting(props: Props) {
  return <LabeledSwitchInput {...props} label="Notify when opened or clicked" />
}
