import React from 'react'
import { Field } from 'react-final-form'

import { TextFieldProps } from '@material-ui/core'

import { MUITextInput } from 'components/Forms/MUITextInput'

import { validateTimeInput } from '../../../../../helpers'

interface Props {
  textFieldProps?: TextFieldProps
}

export const Time = ({ textFieldProps = {} }: Props) => {
  return (
    <Field
      required
      fullWidth
      name="time"
      label="Time"
      type="time"
      size="small"
      margin="none"
      variant="outlined"
      autoComplete="off"
      InputLabelProps={{ shrink: true }}
      {...textFieldProps}
      validate={validateTimeInput}
      component={MUITextInput}
    />
  )
}
