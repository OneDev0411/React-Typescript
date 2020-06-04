import React from 'react'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import { Dropdown } from 'components/Dropdown'
import { DropdownToggleButton } from 'components/DropdownToggleButton'
import { eventTypesIcons } from 'views/utils/event-types-icons'

const ITEMS = [
  {
    title: 'Call',
    value: 'Call'
  },
  {
    title: 'In-Person Meeting',
    value: 'In-Person Meeting'
  },
  {
    title: 'Text',
    value: 'Text'
  },
  {
    title: 'Chat',
    value: 'Chat'
  },
  {
    title: 'Mail',
    value: 'Mail'
  },
  {
    title: 'Email',
    value: 'Email'
  },
  {
    title: 'Other',
    value: 'Other'
  }
]

export function EventType() {
  return (
    <Field
      name="task_type"
      render={({ input }) => (
        // @ts-ignore js-component
        <Dropdown
          input={input}
          icons={eventTypesIcons}
          items={ITEMS}
          fullHeight
          style={{ marginBottom: '1em' }}
          buttonRenderer={({ icon: Icon, iconColor, ...props }) => (
            <DropdownToggleButton {...props} isActive={props.isOpen}>
              <Flex alignCenter>
                {Icon && (
                  <Icon
                    style={{
                      marginRight: '0.5em',
                      fill: iconColor || '#000'
                    }}
                  />
                )}
                {props.value}
              </Flex>
            </DropdownToggleButton>
          )}
        />
      )}
    />
  )
}
