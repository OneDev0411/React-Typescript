import React from 'react'
import { Field } from 'react-final-form'

import { Dropdown } from '../../../../../../components/Dropdown'
import { REMINDER_ITEMS } from '../../../../../../utils/reminder'
import IconBell from '../../../../../../components/SvgIcons/Bell/IconBell'

import { DropButton, IconDrop } from '../../styled'

export function Reminder(props) {
  const dueDateTimestamp = new Date(props.dueDate).getTime()
  const now = new Date().getTime()

  if (dueDateTimestamp < now - 1) {
    return null
  }

  return (
    <Field
      name="reminder"
      render={({ input }) => (
        <Dropdown
          input={input}
          items={REMINDER_ITEMS.filter(
            ({ value }) => value == null || value <= dueDateTimestamp - now
          )}
          fullHeight
          buttonRenderer={props => (
            <DropButton {...props} inverse style={{ paddingLeft: 0 }}>
              <IconBell />
              {props.value}
              <IconDrop
                isOpen={props.isOpen}
                style={{ margin: '0.25rem 0 0 0.25rem' }}
              />
            </DropButton>
          )}
        />
      )}
    />
  )
}
