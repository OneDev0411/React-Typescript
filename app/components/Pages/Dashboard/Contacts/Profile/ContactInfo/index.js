import React from 'react'

import SectionWithFields from '../components/SectionWithFields'

const fieldsOrder = [
  'first_name',
  'middle_name',
  'last_name',
  'email',
  'phone_number',
  'source',
  'facebook',
  'instagram',
  'linkedin',
  'tiktok',
  'social',
  'website',
  'source_type'
]

export function ContactInfo(props) {
  return (
    <SectionWithFields
      title="Contact Info"
      section="Contact Info"
      contact={props.contact}
      fieldsOrder={fieldsOrder}
      submitCallback={props.submitCallback}
    />
  )
}
