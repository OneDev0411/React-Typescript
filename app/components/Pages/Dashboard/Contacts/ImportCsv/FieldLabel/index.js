import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import cn from 'classnames'
import _ from 'underscore'
import { isAddressField } from '../helpers/address'

/**
 * returns all options
 * @param {Array} labels - all possible options of selected field
 */
function getAllOptions(labels) {
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

  const handleChangeValue = data => {
    const value = data ? data.value : null

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

  return (
    <Select
      name="form-field-label"
      placeholder="Select Label"
      value={selectedLabel}
      onChange={handleChangeValue}
      options={options}
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
