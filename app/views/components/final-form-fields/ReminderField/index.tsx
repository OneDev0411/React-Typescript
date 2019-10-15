import React from 'react'
import { Field } from 'react-final-form'

import { Dropdown } from 'components/Dropdown'
import { REMINDER_DROPDOWN_OPTIONS } from 'views/utils/reminder'
import IconBell from 'components/SvgIcons/Bell/IconBell'

import { DropButton, IconDrop } from './styled'

interface Props {
  dropDownProps?: object
  dueDate: Date
}

export function ReminderField({ dropDownProps = {}, dueDate }: Props) {
  const now = Date.now()
  const dueDateTimestamp = dueDate.getTime()

  return (
    <Field
      name="reminder"
      render={({ input }) => (
        <>
          {/*
          // @ts-ignore js component */}
          <Dropdown
            {...dropDownProps}
            input={input}
            items={REMINDER_DROPDOWN_OPTIONS.filter(
              ({ value }) => value == null || value <= dueDateTimestamp - now
            )}
            fullHeight
            buttonRenderer={buttonProps => (
              <DropButton {...buttonProps} inverse style={{ paddingLeft: 0 }}>
                <IconBell />
                {buttonProps.value}
                <IconDrop
                  isOpen={buttonProps.isOpen}
                  style={{ margin: '0.25rem 0 0 0.25rem' }}
                />
              </DropButton>
            )}
          />
        </>
      )}
    />
  )
}
