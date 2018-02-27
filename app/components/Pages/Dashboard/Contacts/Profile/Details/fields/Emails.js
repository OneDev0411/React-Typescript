import React from 'react'
import MultiFields from '../components/MultiFields'

const LABEL_OPTIONS = {
  personal: 'Personal Email',
  business: 'Business Email'
}

export default function Emails({ contact }) {
  const validator = email => {
    const regular = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return new RegExp(regular).exec(email)
  }

  return (
    <MultiFields
      type="email"
      name="emails"
      contact={contact}
      defaultLabel="Email"
      validator={validator}
      labelTitles={LABEL_OPTIONS}
      placeholder="example@gmail.com"
      validationText="Invalid email."
    />
  )
}
