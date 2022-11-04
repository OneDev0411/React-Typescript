import React from 'react'

import SectionWithFields from '../components/SectionWithFields'

const fieldsOrder = [
  'title',
  'nickname',
  'job_title',
  'company',
  'marketing_name'
]

export function Details(props) {
  return (
    <SectionWithFields
      title="Details"
      section="Details"
      contact={props.contact}
      fieldsOrder={fieldsOrder}
      submitCallback={props.submitCallback}
    />
  )
}
