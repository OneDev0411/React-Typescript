import React from 'react'
import MultiFields from '../components/MultiFields'

const LABEL_OPTIONS = {
  default: {
    title: 'Website',
    icon: {
      name: 'briefcase',
      color: '#15bd6b'
    }
  },
  instagram: {
    title: 'Instagram',
    icon: {
      name: 'instagram',
      color: '#EC3661'
    }
  },
  facebook: {
    title: 'Facebook',
    icon: {
      color: '#4367B2',
      name: 'facebook-square'
    }
  },
  twitter: {
    title: 'Twitter',
    icon: {
      name: 'twitter-square',
      color: '#1da1f2'
    }
  },
  blog: {
    title: 'Blog',
    icon: {
      name: 'wordpress',
      color: '#446'
    }
  }
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
      labels={LABEL_OPTIONS}
      placeholder="rechat.com"
      validationText="Invalid URL."
    />
  )
}
