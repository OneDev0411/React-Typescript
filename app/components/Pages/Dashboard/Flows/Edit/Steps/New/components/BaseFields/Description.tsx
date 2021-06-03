import React, { useState } from 'react'
import { Field } from 'react-final-form'

import { Button } from '@material-ui/core'
import { TextFieldProps } from '@material-ui/core'

import { MUITextInput } from 'components/Forms/MUITextInput'

interface Props {
  enabled?: boolean
  textFieldProps?: TextFieldProps
}

export const Description = ({
  enabled = false,
  textFieldProps = {}
}: Props) => {
  const [isEnable, setIsEnable] = useState<boolean>(enabled)

  const handleEnableDescription = () => setIsEnable(true)

  if (!isEnable) {
    return (
      <Button
        color="secondary"
        size="small"
        disabled={textFieldProps.disabled || false}
        onClick={handleEnableDescription}
      >
        Add description for yourself
      </Button>
    )
  }

  return (
    <Field
      fullWidth
      multiline
      size="small"
      margin="none"
      variant="outlined"
      autoComplete="off"
      name="description"
      label="Description"
      FormHelperTextProps={{
        variant: 'standard'
      }}
      {...textFieldProps}
      component={MUITextInput}
    />
  )
}
