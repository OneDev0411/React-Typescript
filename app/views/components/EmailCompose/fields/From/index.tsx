import { TextField } from 'final-form-material-ui'
import { FieldRenderProps } from 'react-final-form'
import * as React from 'react'
import { FormLabel } from '@material-ui/core'
import { TextFieldProps } from '@material-ui/core/TextField'

export function From({
  InputProps,
  ...props
}: FieldRenderProps<any> & TextFieldProps) {
  return (
    <TextField
      InputProps={{
        startAdornment: (
          <FormLabel style={{ marginRight: '1rem' }}>From</FormLabel>
        ),
        disableUnderline: true,
        readOnly: true,
        ...(InputProps || {})
      }}
      fullWidth
      margin="dense"
      {...props}
    />
  )
}
