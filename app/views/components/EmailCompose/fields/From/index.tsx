import { TextField } from 'final-form-material-ui'
import { FieldRenderProps } from 'react-final-form'
import * as React from 'react'
import { TextFieldProps } from '@material-ui/core/TextField'

import { useTheme } from '@material-ui/core'

import { InlineInputLabel } from '../../../InlineInputLabel'

export function From({
  InputProps,
  input,
  ...props
}: FieldRenderProps<any> & TextFieldProps) {
  const theme = useTheme()

  const value = input.value
    ? `${input.value.display_name} <${input.value.email}>`
    : ' - '

  return (
    <TextField
      InputProps={{
        startAdornment: (
          <InlineInputLabel style={{ marginBottom: `${theme.spacing(1)}px` }}>
            From
          </InlineInputLabel>
        ),
        disableUnderline: true,
        readOnly: true,
        ...(InputProps || {})
      }}
      fullWidth
      margin="dense"
      input={{
        ...input,
        value
      }}
      {...props}
    />
  )
}
