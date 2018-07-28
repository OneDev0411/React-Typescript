import React from 'react'

import { Select } from '../../../../../components/final-form-fields'

const ITEMS = ['Connected', 'No Answer', 'Left voicemail', 'Wrong number'].map(
  value => ({ title: value, value })
)

export function Outcome() {
  return <Select items={ITEMS} label="Outcome" name="outcome" required />
}
