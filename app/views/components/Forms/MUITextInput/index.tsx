import * as React from 'react'
import { FieldRenderProps } from 'react-final-form'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'

export const MUITextInput: React.FC<
  FieldRenderProps<string, HTMLInputElement | HTMLTextAreaElement> &
    TextFieldProps
> = ({
  input: { name, onChange, value, ...restInput },
  meta,
  color = 'secondary',
  ...rest
}) => {
  // TODO: we may need to change this condition in the future
  const showError = Boolean(meta.submitFailed && meta.error)

  return (
    <TextField
      {...rest}
      name={name}
      helperText={showError ? meta.error || meta.submitError : undefined}
      error={showError}
      inputProps={restInput}
      onChange={onChange}
      value={value}
      color={color}
    />
  )
}
