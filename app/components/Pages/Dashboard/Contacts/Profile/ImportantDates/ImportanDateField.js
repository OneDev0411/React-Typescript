import React from 'react'
import { format } from 'fecha'
import { connect } from 'react-redux'

import MultiFields from '../Details/components/MultiFields'

import { getAttributeLabels } from '../../../../../../models/contacts/helpers/get-attribute-labels'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'

function ImportanDateField({ contact, attributeDef }) {
  const validator = date => {
    /*
      Match dates (M/D/YY, M/D/YYY, MM/DD/YY, MM/DD/YYYY)
      This regex will match a string as a date in the formats
      M/D/YY, M/D/YYY, MM/DD/YY, and MM/DD/YYYY.
      It does not correct for leap year.
    */

    const regular = /^((0?[13578]|10|12)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[01]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1}))|(0?[2469]|11)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[0]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1})))$/

    return new RegExp(regular).exec(date)
  }

  const handleFormat = unix_timestamp => {
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000

    if (typeof unix_timestamp === 'number') {
      return format(unix_timestamp * 1000 - timezoneOffset, 'MM/DD/YYYY')
    }

    if (typeof unix_timestamp === 'string' && validator(unix_timestamp)) {
      return unix_timestamp
    }

    return null
  }

  const handleParse = date => new Date(date).getTime() / 1000

  return (
    <MultiFields
      attributeName="important_date"
      contact={contact}
      defaultLabels={getAttributeLabels(attributeDef)}
      handleFormat={handleFormat}
      handleParse={handleParse}
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
