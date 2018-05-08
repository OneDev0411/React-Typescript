import React from 'react'

import MultiFields from '../components/MultiFields'

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
  const isEmail = email => {
    const regular = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return new RegExp(regular).exec(email)
  }

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
