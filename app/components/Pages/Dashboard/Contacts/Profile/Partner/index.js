import React from 'react'

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
      contact={props.contact}
      fieldsOrder={fieldsOrder}
      validFields={fieldsOrder}
      isPartner
      section={['Contact Info', 'Details', 'Dates']}
      title="Spouse/Partner"
      submitCallback={props.submitCallback}
    />
  )
}
