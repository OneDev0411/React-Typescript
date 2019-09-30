import React from 'react'

import SectionWithFields from '../components/SectionWithFields'

const fieldsOrder = [
  'birthday',
  'child_birthday',
  'wedding_anniversary',
  'home_anniversary',
  'work_anniversary'
]

export function Dates(props) {
  return (
    <SectionWithFields
      contact={props.contact}
      fieldsOrder={fieldsOrder}
      section="Dates"
      title="Touch Dates"
      submitCallback={props.submitCallback}
      onChangeAttribute={props.onChangeAttribute}
    />
  )
}
