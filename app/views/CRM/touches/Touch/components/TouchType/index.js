import React from 'react'

import { Select } from '../../../../../components/final-form-fields'

const ITEMS = ['Meeting', 'Call', 'Text', 'Email', 'Mail', 'Social'].map(
  value => ({ title: value, value })
)

export function TouchType() {
  return (
    <Select
      fullWidth={false}
      hasEmptyItem={false}
      items={ITEMS}
      label="Type"
      name="activity_type"
      required
    />
  )
}
