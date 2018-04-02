import React from 'react'
import { Field } from 'react-final-form'

import { Item } from '../DropdownItem'
import { Dropdown } from '../../../../../../components/Dropdown'

const ITEMS = [
  {
    title: 'Call',
    value: 'Call'
  },
  {
    title: 'Closing',
    value: 'Closing'
  },
  {
    title: 'Follow up',
    value: 'Follow up'
  },
  {
    title: 'Inspection',
    value: 'Inspection'
  },
  {
    title: 'Listing appointment',
    value: 'Listing appointment'
  },
  {
    title: 'Message',
    value: 'Message'
  },
  {
    title: 'Open House',
    value: 'Open House'
  },
  {
    title: 'Todo',
    value: 'Todo'
  },
  {
    title: 'Tour',
    value: 'Tour'
  }
]

export default function TaskType() {
  return (
    <div className="c-new-task__type c-new-task__field">
      <label htmlFor="new-task__type" className="c-new-task__field__label">
        Type
      </label>
      <div style={{ display: 'flex' }}>
        <Field
          items={ITEMS}
          name="task_type"
          id="new-task__type"
          component={Dropdown}
          itemToString={({ title }) => title}
          itemRenderer={({ item, ...props }) => (
            <Item key={item.value} {...props}>
              {item.title}
            </Item>
          )}
        />
      </div>
    </div>
  )
}
