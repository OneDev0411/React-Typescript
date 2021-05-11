import React from 'react'

import { mdiRing } from '@mdi/js'

import SectionWithFields from '../components/SectionWithFields'

export const fieldsOrder = [
  'first_name',
  'last_name',
  'email',
  'phone_number',
  'birthday'
]

export function Partner(props) {
  return (
    <SectionWithFields
      title="Spouse/Partner"
      expandButtonLabel="Add Spouse & Partner Info"
      expandButtonIcon={mdiRing}
      section={['Contact Info', 'Details', 'Dates']}
      contact={props.contact}
      fieldsOrder={fieldsOrder}
      validFields={fieldsOrder}
      isPartner
      submitCallback={props.submitCallback}
    />
  )
}
