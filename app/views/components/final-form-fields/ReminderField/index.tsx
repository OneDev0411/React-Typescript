import React from 'react'
import { Field } from 'react-final-form'

import { Dropdown } from 'components/Dropdown'
import { DropdownToggleButton } from 'components/DropdownToggleButton'
import { REMINDER_DROPDOWN_OPTIONS } from 'views/utils/reminder'
import IconBell from 'components/SvgIcons/Bell/IconBell'

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
              <DropdownToggleButton {...buttonProps}>
                <IconBell />
                {buttonProps.value}
              </DropdownToggleButton>
            )}
          />
        </>
      )}
    />
  )
}
