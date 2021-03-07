import React from 'react'
import { Field } from 'react-final-form'

import { TextFieldProps } from '@material-ui/core'

import { MUITextInput } from 'components/Forms/MUITextInput'

import { MAX_STEP_TITLE_LENGTH } from '../../../../../constants'

import { validateStringInput } from '../../../../../helpers'

interface Props {
  textFieldProps?: TextFieldProps
}

export const Title = ({ textFieldProps = {} }: Props) => {
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
      {...textFieldProps}
      validate={value =>
        validateStringInput(
          value as string,
          'event title',
          MAX_STEP_TITLE_LENGTH
        )
      }
    />
  )
}
