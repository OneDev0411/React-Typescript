import React from 'react'

import SectionWithFields from '../components/SectionWithFields'

const fieldsOrder = [
  'email',
  'phone_number',
  'source',
  'website',
  'source_type'
]

export function ContactInfo(props) {
  return (
    <SectionWithFields
      contact={props.contact}
      fieldsOrder={fieldsOrder}
      section="Contact Info"
    />
  )
}
