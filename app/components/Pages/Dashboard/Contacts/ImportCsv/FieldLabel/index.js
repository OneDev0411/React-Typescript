import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { BasicDropdown } from 'components/BasicDropdown'

import { isAddressField } from '../helpers/address'

/**
 * returns all options
 * @param {Array} labels - all possible options of selected field
 */
function getAllOptions(labels) {
  if (!Array.isArray(labels)) {
    return []
  }

  return labels.map(name => ({
    value: name,
    label: name
  }))
}

/**
 * returns possible options of this field.
 * this function avoids selecting * multiple fields with same index
 * @param {Array} labels - all possible options of selected field
 * @param {Object} attributes - list of attribute definitions
 * @param {Object} mappedFields - list of mapped fields
 * @param {Integer} definitionId, definition id of selected field
 * @param {Integer} index, index id of selected field
 */
function getPossibleOptions(
  labels,
  attributes,
  mappedFields,
  definitionId,
  index
) {
  if (!isAddressField(attributes, definitionId)) {
    return getAllOptions(labels)
  }

  const field = _.find(
    mappedFields,
    field =>
      field.label &&
      isAddressField(attributes, field.definitionId) &&
      field.index === index
  )

  if (field) {
    return [
      {
        value: field.label,
        label: field.label
      }
    ]
  }

  return getAllOptions(labels)
}

const FieldLabel = ({
  columnName,
  labels,
  fieldName,
  onChange,
  attributes,
  mappedFields
}) => {
  const { definitionId, index, label: selectedLabel } = mappedFields[columnName]

  const handleChangeValue = value => {
    if (value !== selectedLabel) {
      onChange(fieldName, value)
    }
  }

  const options = getPossibleOptions(
    labels,
    attributes,
    mappedFields,
    definitionId,
    index
  )

  const selectedField = {
    value: selectedLabel,
    label: selectedLabel
  }

  const hasValue = Boolean(selectedField.value)

  const buttonStyle = {
    borderColor: '#d9d9d9',
    color: hasValue ? '#262626' : '#aaa'
  }

  const defaultSelectedItem = hasValue
    ? selectedField
    : {
        value: undefined,
        label: '--Select--'
      }

  return (
    <BasicDropdown
      isBlock
      items={options}
      buttonStyle={buttonStyle}
      onChange={handleChangeValue}
      defaultSelectedItem={defaultSelectedItem}
    />
  )
}

function mapStateToProps({ contacts }) {
  const { importCsv, attributeDefs } = contacts

  return {
    attributes: attributeDefs,
    mappedFields: importCsv.mappedFields
  }
}

export default connect(mapStateToProps)(FieldLabel)
