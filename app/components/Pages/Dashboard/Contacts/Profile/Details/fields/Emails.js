import React from 'react'
import MultiFields from '../components/MultiFields'

export default function Emails({ contact }) {
  const validator = email => {
    const regular = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return new RegExp(regular).exec(email)
  }

  return (
    <MultiFields
      type="email"
      name="emails"
      title="Email"
      contact={contact}
      validator={validator}
      placeholder="example@gmail.com"
      validationText="Invalid email."
    />
  )
}
