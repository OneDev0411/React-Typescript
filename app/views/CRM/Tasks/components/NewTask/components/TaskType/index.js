import React from 'react'

import { Select } from '../../../../../../components/final-form-fields'

const ITEMS = [
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

export function TaskType() {
  return (
    <Select hasEmptyItem={false} items={ITEMS} label="Type" name="task_type" />
  )
}
