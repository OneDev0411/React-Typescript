import * as React from 'react'
import { FieldRenderProps } from 'react-final-form'
import TextField from '@material-ui/core/TextField'

export const MUITextInput: React.SFC<
  FieldRenderProps<HTMLInputElement | HTMLTextAreaElement>
> = ({ input: { name, onChange, value, ...restInput }, meta, ...rest }) => {
  const showError = meta.submitFailed && meta.error // TODO: we may need to change this condition in the future

  return (
    <TextField
      {...rest}
      name={name}
      helperText={showError ? meta.error || meta.submitError : undefined}
      error={showError}
      inputProps={restInput}
      onChange={onChange}
      value={value}
    />
  )
}
