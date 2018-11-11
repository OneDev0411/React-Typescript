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
      addNewFieldButtonText="Add Partner/Spouse"
      contact={props.contact}
      fieldsOrder={fieldsOrder}
      validFields={fieldsOrder}
      isPartner
      section={['Contact Info', 'Details', 'Dates']}
      title="Partner/Spouse"
    />
  )
}
