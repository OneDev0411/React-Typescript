import React from 'react'

import { ReminderField } from 'components/final-form-fields'

export default function Reminder(props: { dueDate: Date }) {
  if (props.dueDate.getTime() < Date.now() - 1) {
    return null
  }

  return <ReminderField dueDate={props.dueDate} />
}
