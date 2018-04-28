import React from 'react'

import MultiFields from '../components/MultiFields'
import { isEmail } from '../../../../../../../utils/validations'

const DEFAULT_LABELS = {
  personal: {
    name: 'Personal',
    title: 'Personal Email'
  },
  work: {
    name: 'Work',
    title: 'Work Email'
  },
  default: {
    name: 'Other',
    title: 'Other Email'
  }
}

export default function Emails({ contact }) {
  return (
    <MultiFields
      attributeName="email"
      contact={contact}
      defaultLabels={DEFAULT_LABELS}
      placeholder="example@gmail.com"
      validator={isEmail}
      validationText="Invalid email."
    />
  )
}
