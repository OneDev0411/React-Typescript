import React from 'react'
import { Field } from 'react-final-form'

import { MUITextInput } from 'components/Forms/MUITextInput'

import { MAX_STEP_TITLE_LENGTH } from '../../../../constants'

import { validateStringInput } from '../../../../helpers'

export const Title = () => {
  return (
    <Field
      required
      autoFocus
      fullWidth
      size="small"
      name="title"
      label="Title"
      margin="none"
      variant="outlined"
      autoComplete="off"
      component={MUITextInput}
      FormHelperTextProps={{
        variant: 'standard'
      }}
      validate={value =>
        validateStringInput(value, 'event title', MAX_STEP_TITLE_LENGTH)
      }
    />
  )
}
