import React, { useState } from 'react'
import { Field } from 'react-final-form'

import { Button } from '@material-ui/core'

import { MUITextInput } from 'components/Forms/MUITextInput'

export const Description = () => {
  const [isEnable, setIsEnable] = useState<boolean>(false)

  const handleEnableDescription = () => setIsEnable(true)

  if (!isEnable) {
    return (
      <Button color="secondary" size="small" onClick={handleEnableDescription}>
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
      component={MUITextInput}
    />
  )
}
