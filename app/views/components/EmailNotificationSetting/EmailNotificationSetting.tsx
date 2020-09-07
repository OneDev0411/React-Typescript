import React from 'react'
import {
  FormControlLabel,
  Switch,
  SwitchProps,
  Typography
} from '@material-ui/core'

interface Props extends SwitchProps {}

export default function EmailNotificationSetting(props: Props) {
  return (
    <FormControlLabel
      control={<Switch {...props} />}
      label={
        <Typography variant="body2">Notify when opened or clicked</Typography>
      }
      labelPlacement="start"
    />
  )
}
