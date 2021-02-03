import React from 'react'
import { Field } from 'react-final-form'

import { MUITextInput } from 'components/Forms/MUITextInput'

import { validateTimeInput } from '../../../../helpers'

export const Time = () => {
  return (
    <Field
      name="at"
      label="At"
      margin="dense"
      autoComplete="off"
      type="time"
      variant="outlined"
      required
      InputLabelProps={{ shrink: true }}
      validate={validateTimeInput}
      component={MUITextInput}
    />
  )
}
