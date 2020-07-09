import React from 'react'

import { isPhoneNumber } from 'utils/validations'

import { MultiField } from '../MultiField'

export function Phones({ labels, mutators }) {
  return (
    <MultiField
      title="Phone"
      name="phone_number"
      defaultOptions={labels}
      defaultSelectedItem={labels[0]}
      mutators={mutators}
      validate={isPhoneNumber}
    />
  )
}
