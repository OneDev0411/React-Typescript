import React from 'react'
import { Field } from 'react-final-form'

import { MUITextInput } from 'components/Forms/MUITextInput'

import { MAX_STEP_TITLE_LENGTH } from '../../../../constants'

import { validateStringInput } from '../../../../helpers'

export const Title = () => {
  return (
    <Field
      autoFocus
      required
      fullWidth
      name="title"
      label="Title"
      variant="outlined"
      margin="dense"
      autoComplete="off"
      component={MUITextInput}
      validate={value =>
        validateStringInput(value, 'event title', MAX_STEP_TITLE_LENGTH)
      }
    />
  )
}
