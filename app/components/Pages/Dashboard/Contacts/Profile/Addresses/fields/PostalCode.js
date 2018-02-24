import React from 'react'
import Field from '../components/Field'

export default function PostalCodeField(props) {
  const validator = code => new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/).exec(code)

  return (
    <Field
      placeholder="65619"
      validator={validator}
      validationText="Please include numbers. You have added a letter or special character."
      {...props}
    />
  )
}
