import React from 'react'

import MultiFields from '../components/MultiFields'

export default function Jobs({ contact }) {
  return (
    <MultiFields
      attributeName="job_title"
      contact={contact}
      placeholder="Lawyer"
    />
  )
}
