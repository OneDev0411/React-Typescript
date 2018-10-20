import React from 'react'
import { Field } from 'react-final-form'

import { Dropdown } from '../../../../components/Dropdown'
import IconBell from '../../../../components/SvgIcons/Bell/IconBell'

import { DropButton, IconDrop } from '../../styled'

const items = [
  'None',
  'At the time of event',
  '5 Minutes Before',
  '15 Minutes Before',
  '30 Minutes Before',
  '1 Hour Before',
  '1 Day Before',
  '1 Week Before'
].map(value => ({ title: value, value }))

export function Reminder() {
  return (
    <Field
      name="reminder"
      render={({ input }) => (
        <Dropdown
          input={input}
          items={items}
          fullHeight
          pullRight
          buttonRenderer={props => (
            <DropButton
              {...props}
              style={{ paddingLeft: 0 }}
              isActive={props.isOpen}
              inverse
            >
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
