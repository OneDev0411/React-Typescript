import React from 'react'
import { Field } from 'react-final-form'

import { MUITextInput } from 'components/Forms/MUITextInput'

import { validateTimeInput } from '../../../../../helpers'

export const Time = () => {
  return (
    <Field
      required
      name="time"
      label="Time"
      type="time"
      size="small"
      margin="none"
      variant="outlined"
      autoComplete="off"
      InputLabelProps={{ shrink: true }}
      validate={validateTimeInput}
      component={MUITextInput}
    />
  )
}
