import React from 'react'

import { isEmail } from '../../../../../../../utils/validations'

import { MultiField } from '../components/MultiField'

export function Emails({ labels, mutators }) {
  return (
    <MultiField
      title="Email"
      name="email"
      defaultOptions={labels}
      defaultSelectedItem={labels[0]}
      mutators={mutators}
      validate={isEmail}
    />
  )
}
