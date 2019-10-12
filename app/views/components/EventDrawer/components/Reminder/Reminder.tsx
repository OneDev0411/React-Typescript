import React from 'react'

import { ReminderField } from 'components/final-form-fields'

import { FieldContainer } from '../../styled'

export default function Reminder(props: { dueDate: Date }) {
  const dueDateTimestamp = new Date(props.dueDate).getTime()
  const now = Date.now()

  if (dueDateTimestamp < now - 1) {
    return null
  }

  return (
    <FieldContainer alignCenter justifyBetween style={{ marginBottom: '2em' }}>
      <ReminderField dueDate={props.dueDate} />
    </FieldContainer>
  )
}
