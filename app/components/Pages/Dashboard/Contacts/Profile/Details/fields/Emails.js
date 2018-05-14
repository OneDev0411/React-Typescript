import React from 'react'
import { connect } from 'react-redux'

import MultiFields from '../components/MultiFields'

import { getEmailLabels } from '../../../../../../../models/contacts/helpers/get-attribute-labels'
import { selectDefinitionByName } from '../../../../../../../reducers/contacts/attributeDefs'

function Emails({ contact, attributeDef }) {
  const isEmail = email => {
    const regular = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return new RegExp(regular).exec(email)
  }

  return (
    <MultiFields
      attributeName="email"
      contact={contact}
      defaultLabels={getEmailLabels(attributeDef)}
      placeholder="example@gmail.com"
      validator={isEmail}
      validationText="Invalid email."
    />
  )
}

function mapStateToProps({ contacts }) {
  return {
    attributeDef: selectDefinitionByName(contacts.attributeDefs, 'email')
  }
}

export default connect(mapStateToProps)(Emails)
