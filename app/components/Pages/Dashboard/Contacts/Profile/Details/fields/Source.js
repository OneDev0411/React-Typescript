import React from 'react'

import MultiFields from '../components/MultiFields'

export function Source({ contact }) {
  return (
    <MultiFields
      attributeName="source"
      contact={contact}
      placeholder="Spring campaign"
    />
  )
}
