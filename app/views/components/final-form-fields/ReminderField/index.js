import React from 'react'
import { Field } from 'react-final-form'

import { Dropdown } from 'components/Dropdown'
import { REMINDER_DROPDOWN_OPTIONS } from 'views/utils/reminder'
import IconBell from 'components/SvgIcons/Bell/IconBell'

import { DropButton, IconDrop } from './styled'

export function ReminderField(props) {
  const dueDateTimestamp = new Date(props.dueDate).getTime()
  const now = Date.now()

  if (dueDateTimestamp < now - 1) {
    return null
  }

  return (
    <Field
      name="reminder"
      render={({ input }) => (
        <Dropdown
          input={input}
          items={REMINDER_DROPDOWN_OPTIONS.filter(
            ({ value }) => value == null || value <= dueDateTimestamp - now
          )}
          fullHeight
          pullLeft
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
