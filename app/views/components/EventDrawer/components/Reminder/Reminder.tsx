import React from 'react'

import { Field } from 'react-final-form'
import { mdiBellOutline } from '@mdi/js'

import { EventField } from '../EventField'
import { Selector } from './Selector'

interface Props {
  dueDate: Date
}

export default function Reminder({ dueDate }: Props) {
  if (dueDate.getTime() < Date.now() - 1) {
    return null
  }

  return (
    <EventField
      title="reminder"
      iconProps={{
        path: mdiBellOutline
      }}
    >
      <Field
        name="reminder"
        render={({ input }) => <Selector input={input} />}
      />
    </EventField>
  )
}
