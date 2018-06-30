import React from 'react'
import { connect } from 'react-redux'

import { validator, format, parse } from './helpers'
import MultiFields from '../Details/components/MultiFields'

import { getAttributeLabels } from '../../../../../../models/contacts/helpers/get-attribute-labels'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'

function ImportanDateField({ contact, attributeDef }) {
  return (
    <MultiFields
      attributeName="important_date"
      contact={contact}
      defaultLabels={getAttributeLabels(attributeDef)}
      handleFormat={format}
      handleParse={parse}
      placeholder="MM/DD/YYYY"
      showPrimary={false}
      showSuffix={false}
      validator={validator}
      validationText="Invalid format. Valid format MM/DD/YYYY"
    />
  )
}

function mapStateToProps({ contacts }) {
  return {
    attributeDef: selectDefinitionByName(
      contacts.attributeDefs,
      'important_date'
    )
  }
}

export default connect(mapStateToProps)(ImportanDateField)
