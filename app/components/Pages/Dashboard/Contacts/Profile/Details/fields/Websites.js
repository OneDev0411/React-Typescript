import React from 'react'
import { connect } from 'react-redux'

import MultiFields from '../components/MultiFields'

import { getWebsiteLabels } from '../../../../../../../models/contacts/helpers/get-attribute-labels'
import { selectDefinitionByName } from '../../../../../../../reducers/contacts/attributeDefs'

const Websites = ({ contact, attributeDef }) => (
  <MultiFields
    attributeName="website"
    contact={contact}
    defaultLabels={getWebsiteLabels(attributeDef)}
    placeholder="rechat.com"
  />
)

function mapStateToProps({ contacts }) {
  return {
    attributeDef: selectDefinitionByName(contacts.attributeDefs, 'website')
  }
}

export default connect(mapStateToProps)(Websites)
