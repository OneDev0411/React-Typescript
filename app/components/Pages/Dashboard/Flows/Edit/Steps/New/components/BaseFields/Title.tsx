import React from 'react'

import { TextFieldProps } from '@material-ui/core'
import { Field } from 'react-final-form'

import { MUITextInput } from 'components/Forms/MUITextInput'

import { MAX_STEP_TITLE_LENGTH } from '../../../../../constants'
import { validateStringInput } from '../../../../../helpers'

interface Props {
  label?: string
  textFieldProps?: TextFieldProps
}

export const Title = ({ label = 'Title', textFieldProps = {} }: Props) => {
  return (
    <Field
      required
      autoFocus
      fullWidth
      size="small"
      name="title"
      label={label}
      margin="none"
      variant="outlined"
      autoComplete="off"
      component={MUITextInput}
      FormHelperTextProps={{
        variant: 'standard'
      }}
      {...textFieldProps}
      validate={value =>
        validateStringInput(value as string, label, MAX_STEP_TITLE_LENGTH)
      }
    />
  )
}
