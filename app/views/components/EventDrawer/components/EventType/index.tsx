import React from 'react'
import { Field } from 'react-final-form'

import { Selector } from './Selector'

export function EventType() {
  return (
    <Field
      name="task_type"
      render={({ input }) => <Selector input={input} />}
    />
  )
}
