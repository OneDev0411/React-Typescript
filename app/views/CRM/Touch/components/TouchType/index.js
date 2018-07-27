import React from 'react'

import { Select } from '../../../../components/final-form-fields'

const ITEMS = ['Meeting', 'Call', 'Text', 'Email', 'Mail', 'Social']

export function TouchType() {
  return (
    <Select
      hasEmptyItem={false}
      items={ITEMS.map(value => ({ title: value, value }))}
      label="Type"
      name="activity_type"
      required
    />
  )
}
