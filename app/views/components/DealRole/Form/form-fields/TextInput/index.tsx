import React from 'react'
import { TextField } from '@material-ui/core'
import { FieldInputProps, FieldMetaState } from 'react-final-form'

interface Props {
  label: string
  name: string
  isVisible: boolean
  input: FieldInputProps<any, HTMLElement>
  meta: FieldMetaState<any>
}

export function TextInput({
  input,
  meta,
  label,
  name,
  isVisible = true
}: Props) {
  if (!isVisible) {
    return null
  }

  return (
    <TextField
      {...input}
      error={meta.submitFailed && meta.error}
      helperText={meta.error}
      name={name}
      label={label}
      variant="outlined"
      fullWidth
    />
  )
}
