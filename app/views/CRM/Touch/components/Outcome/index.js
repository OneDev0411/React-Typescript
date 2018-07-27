import React from 'react'

import { Select } from '../../../../components/final-form-fields'

const ITEMS = ['Connected', 'No Answer', 'Left voicemail', 'Wrong number']

export function Outcome() {
  return (
    <Select
      items={ITEMS.map(value => ({ title: value, value }))}
      label="Outcome"
      name="outcome"
      required
    />
  )
}
