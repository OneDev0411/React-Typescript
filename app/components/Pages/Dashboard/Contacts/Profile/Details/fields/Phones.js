import React from 'react'

import MultiFields from '../components/MultiFields'

const DEFAULT_LABELS = {
  mobile: {
    name: 'Mobile',
    title: 'Mobile Phone'
  },
  home: {
    name: 'Home',
    title: 'Home Phone'
  },
  work: {
    name: 'Work',
    title: 'Work Phone'
  },
  main: {
    name: 'Main',
    title: 'Main Phone'
  },
  default: {
    name: 'Other',
    title: 'Other Phone'
  }
}

export default function Phones({ contact }) {
  const validator = async phone => {
    if (phone) {
      const {
        PhoneNumberUtil
      } = await import('google-libphonenumber' /* webpackChunkName: "glpn" */)
      const phoneUtil = PhoneNumberUtil.getInstance()

      try {
        let phoneNumber = phoneUtil.parse(phone, 'US')

        const isValid = await phoneUtil.isValidNumber(phoneNumber)

        return isValid
      } catch (error) {
        return false
      }
    } else {
      return false
    }
  }

  return (
    <MultiFields
      attributeName="phone_number"
      contact={contact}
      defaultLabels={DEFAULT_LABELS}
      placeholder="313-444-9898"
      validator={validator}
      validationText="Invalid phone number."
    />
  )
}
