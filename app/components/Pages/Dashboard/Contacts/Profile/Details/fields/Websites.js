import React from 'react'
import MultiFields from '../components/MultiFields'

const LABEL_OPTIONS = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'Twitter',
  personal: 'Personal Page',
  business: 'Business Website',
  blog: 'Blog'
}

export default function Websites({ contact }) {
  const validator = url => {
    const regular = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/

    return new RegExp(regular).exec(url)
  }

  return (
    <MultiFields
      type="website"
      name="websites"
      contact={contact}
      validator={validator}
      defaultLabel="Website"
      placeholder="rechat.com"
      labelTitles={LABEL_OPTIONS}
      validationText="Invalid URL."
    />
  )
}
