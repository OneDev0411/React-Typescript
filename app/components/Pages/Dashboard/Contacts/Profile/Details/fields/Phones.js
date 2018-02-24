import React from 'react'
import MultiFields from '../components/MultiFields'

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
      title="Phone"
      contact={contact}
      type="phone_number"
      name="phone_numbers"
      validator={validator}
      placeholder="313-444-9898"
      validationText="Invalid phone number."
    />
  )
}
