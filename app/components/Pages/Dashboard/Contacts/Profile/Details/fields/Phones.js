import React from 'react'
import MultiFields from '../components/MultiFields'

const LABEL_OPTIONS = {
  mobile: {
    title: 'Cell Phone'
  },
  home: {
    title: 'Home Phone'
  },
  office: {
    title: 'Office Phone'
  },
  default: {
    title: 'Phone'
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
      contact={contact}
      type="phone_number"
      name="phone_numbers"
      validator={validator}
      labels={LABEL_OPTIONS}
      placeholder="313-444-9898"
      validationText="Invalid phone number."
    />
  )
}
