import React from 'react'
import { Field } from 'react-final-form'

import { WaitForFields } from './Fields'

interface Props {
  disabled?: boolean
}

export const WaitFor = ({ disabled = false }: Props) => {
  return (
    <Field
      name="wait_for"
      label="WaitFor"
      render={({ input: { onChange, value } }) => (
        <WaitForFields value={value} onChange={onChange} disabled={disabled} />
      )}
    />
  )
}
