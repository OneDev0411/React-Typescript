import React from 'react'

import { mdiAccountEditOutline } from '@mdi/js'

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
      title="Contact Info"
      section="Contact Info"
      expandButtonLabel="Edit Other Contact Info"
      expandButtonIcon={mdiAccountEditOutline}
      contact={props.contact}
      fieldsOrder={fieldsOrder}
      submitCallback={props.submitCallback}
    />
  )
}
