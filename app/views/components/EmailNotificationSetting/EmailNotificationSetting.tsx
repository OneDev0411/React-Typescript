import React, { ChangeEvent } from 'react'
import { FormControlLabel, Switch, Typography } from '@material-ui/core'

interface Props {
  checked?: boolean
  onChange?(event: ChangeEvent<HTMLInputElement>, checked: boolean): void
}

export default function EmailNotificationSetting({ checked, onChange }: Props) {
  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={onChange} />}
      label={
        <Typography variant="body2">Notify when opened or clicked</Typography>
      }
      labelPlacement="start"
    />
  )
}
