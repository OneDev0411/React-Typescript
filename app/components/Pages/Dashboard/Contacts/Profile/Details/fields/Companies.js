import React from 'react'

import MultiFields from '../components/MultiFields'

export default function Companies({ contact }) {
  return (
    <MultiFields
      attributeName="company"
      contact={contact}
      placeholder="Pied Piper"
    />
  )
}
