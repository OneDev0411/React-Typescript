import React from 'react'

import SectionWithFields from '../components/SectionWithFields'

const fieldsOrder = [
  'email',
  'phone_number',
  'source',
  'facebook',
  'instagram',
  'linkedin',
  'social',
  'website',
  'source_type'
]

export function ContactInfo(props) {
  return (
    <SectionWithFields
      addNewFieldButtonText="Add Some Information"
      contact={props.contact}
      fieldsOrder={fieldsOrder}
      section="Contact Info"
      submitCallback={props.submitCallback}
    />
  )
}
