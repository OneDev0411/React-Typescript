import React from 'react'
import MultiFields from '../components/MultiFields'

export default function Companies({ contact }) {
  return (
    <MultiFields
      type="company"
      name="companies"
      title="Company"
      contact={contact}
      placeholder="Apple"
    />
  )
}
