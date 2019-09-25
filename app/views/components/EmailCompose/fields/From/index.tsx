import { TextField } from 'final-form-material-ui'
import { FieldRenderProps } from 'react-final-form'
import * as React from 'react'
import { TextFieldProps } from '@material-ui/core/TextField'

import { useTheme } from '@material-ui/core'

import { InlineInputLabel } from '../../../InlineInputLabel'
import { emailFromToDisplayValue } from '../../helpers/email-from-to-display-value'

export function From({
  InputProps,
  input,
  ...props
}: FieldRenderProps<any> & TextFieldProps) {
  const theme = useTheme()

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
        value: emailFromToDisplayValue(input.value)
      }}
      {...props}
    />
  )
}
