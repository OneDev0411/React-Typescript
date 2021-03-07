import React from 'react'
import { Field } from 'react-final-form'

import { Selector } from './Selector'

interface Props {
  disabled?: boolean
}

export function EventType({ disabled = false }: Props) {
  return (
    <Field
      name="task_type"
      render={({ input }) => <Selector input={input} disabled={disabled} />}
    />
  )
}
