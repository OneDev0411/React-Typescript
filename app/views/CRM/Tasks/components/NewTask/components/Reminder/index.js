import React from 'react'
import { Field } from 'react-final-form'

import { Dropdown } from '../../../../../../components/Dropdown'
import IconBell from '../../../../../../components/SvgIcons/Bell/IconBell'

import { compareDates } from '../../helpers/compare-dates'
import { DropButton, IconDrop } from '../../styled'

const getItems = (dueDate = new Date()) => {
  function getReminder(timeDifference) {
    const dueDateTimestamp = dueDate.getTime()

    return new Date(dueDateTimestamp - timeDifference)
  }

  return [
    {
      title: 'None',
      value: 0
    },
    {
      title: 'At the time of event',
      value: dueDate
    },
    {
      title: '5 Minutes Before',
      value: getReminder(300000)
    },
    {
      title: '15 Minutes Before',
      value: getReminder(900000)
    },
    {
      title: '30 Minutes Before',
      value: getReminder(1800000)
    },
    {
      title: '1 Hour Before',
      value: getReminder(3600000)
    },
    {
      title: '1 Day Before',
      value: getReminder(24 * 3600000)
    },
    {
      title: '1 Week Before',
      value: getReminder(7 * 24 * 3600000)
    }
  ]
}

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
          items={getItems(props.dueDate)}
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
