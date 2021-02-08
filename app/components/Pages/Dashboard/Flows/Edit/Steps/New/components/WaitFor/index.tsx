import React from 'react'
import { Field } from 'react-final-form'

import { WaitForFields } from './Fields'

export const WaitFor = () => {
  return (
    <Field
      name="wait_for"
      label="WaitFor"
      render={({ input: { onChange, value } }) => (
        <WaitForFields value={value} onChange={onChange} />
      )}
    />
  )
}
