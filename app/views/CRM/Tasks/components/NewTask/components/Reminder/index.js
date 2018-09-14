import React from 'react'
import { Field } from 'react-final-form'

import { Dropdown } from '../../../../../../components/Dropdown'
import IconBell from '../../../../../../components/SvgIcons/Bell/IconBell'

import { compareDates } from '../../helpers/compare-dates'
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

export function Reminder(props) {
  if (compareDates(props.dueDate, new Date()) === -1) {
    return null
  }

  return (
    <Field
      name="reminder"
      render={({ input }) => (
        <Dropdown
          input={input}
          items={items}
          buttonRenderer={props => (
            <DropButton {...props} style={{ paddingLeft: 0 }}>
              <IconBell />
              {props.value}
              <IconDrop
                isOpen={props.isOpen}
                style={{ margin: '4px 0 0 4px' }}
              />
            </DropButton>
          )}
        />
      )}
    />
  )
}
