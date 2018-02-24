import React from 'react'
import MultiFields from '../components/MultiFields'

export default function Websites({ contact }) {
  const validator = url => {
    const regular = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/

    return new RegExp(regular).exec(url)
  }

  return (
    <MultiFields
      type="website"
      name="websites"
      title="Website"
      contact={contact}
      validator={validator}
      placeholder="rechat.com"
      validationText="Invalid URL."
    />
  )
}
