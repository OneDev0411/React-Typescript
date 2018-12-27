import React from 'react'

import SectionWithFields from '../components/SectionWithFields'

const fieldsOrder = ['birthday', 'important_date']

export function Dates(props) {
  return (
    <SectionWithFields
      addNewFieldButtonText="Add Touch Dates"
      contact={props.contact}
      fieldsOrder={fieldsOrder}
      section="Dates"
      title="Touch Dates"
    />
  )
}
