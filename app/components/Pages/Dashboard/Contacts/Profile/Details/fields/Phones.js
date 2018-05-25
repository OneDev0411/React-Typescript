import React from 'react'
import { connect } from 'react-redux'

import MultiFields from '../components/MultiFields'

import { getPhoneNumberLabels } from '../../../../../../../models/contacts/helpers/get-attribute-labels'
import { selectDefinitionByName } from '../../../../../../../reducers/contacts/attributeDefs'

function Phones({ contact, attributeDef }) {
  const isPhoneNumber = async value => {
    const {
      PhoneNumberUtil
    } = await import('google-libphonenumber' /* webpackChunkName: "glpn" */)
    const phoneUtil = PhoneNumberUtil.getInstance()

    try {
      let phoneNumber = phoneUtil.parse(value, 'US')

      return phoneUtil.isValidNumber(phoneNumber)
    } catch (error) {
      return false
    }
  }

  return (
    <MultiFields
      attributeName="phone_number"
      contact={contact}
      defaultLabels={getPhoneNumberLabels(attributeDef)}
      placeholder="313-444-9898"
      validator={isPhoneNumber}
      validationText="Invalid phone number."
    />
  )
}

function mapStateToProps({ contacts }) {
  return {
    attributeDef: selectDefinitionByName(contacts.attributeDefs, 'phone_number')
  }
}

export default connect(mapStateToProps)(Phones)
