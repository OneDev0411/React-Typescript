import React from 'react'

import { ReminderField } from 'components/final-form-fields'

import { FieldContainer } from '../../styled'

export default function Reminder(props: { dueDate: Date }) {
  if (props.dueDate.getTime() < Date.now() - 1) {
    return null
  }

  return (
    <FieldContainer>
      <ReminderField dueDate={props.dueDate} />
    </FieldContainer>
  )
}
