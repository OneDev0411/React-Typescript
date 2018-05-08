import React from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import _ from 'underscore'
import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'
import { isAddressField, getAddressFields } from '../helpers/address'

/**
 * returns last address index in the map object
 * @param {Object} attributes - all attributes definitions
 * @param {Object} mappedFields - list of mapped fields
 */
function getLastAddressIndex(attributes, mappedFields) {
  const mappedAddressFields = _.filter(mappedFields, field => {
    if (!field.definitionId) {
      return false
    }

    return isAddressField(attributes, field.definitionId)
  })

  if (mappedAddressFields.length === 0) {
    return 0
  }

  const max = _.max(mappedAddressFields, field => field.index)

  return parseInt(max.index, 10) + 1
}

/**
 * return new created options for new indexs
 * @param {Object} attributes - all attributes definitions
 * @param {*} max - last address index
 */
function createNewAddressOptions(attributes, max) {
  const options = {}

  for (let index = 1; index <= max; index++) {
    getAddressFields(attributes).forEach(name => {
      const definition = selectDefinitionByName(attributes, name)

      if (!definition) {
        return false
      }

      options[`${definition.name}${index}`] = {
        ...definition,
        label: definition.label,
        index
      }
    })
  }

  return options
}

/**
 * create field options based on indexing system
 * @param {Object} attributes - all attributes definitions
 * @param {Object} mappedFields - list of mapped fields
 */
function createOptions(attributes, mappedFields) {
  let newOptions = {}
  const lastAddressIndex = getLastAddressIndex(attributes, mappedFields)

  if (lastAddressIndex > 0) {
    newOptions = createNewAddressOptions(attributes, lastAddressIndex)
  }

  const options = {
    ...attributes.byId,
    ...newOptions
  }

  return _.chain(options)
    .filter(({ editable, show }) => editable || show)
    .map(({ id, label, index = 0 }) => ({
      value: `${id}:${index}`,
      label: index > 0 ? `${label} ${index}` : label
    }))
    .value()
}

const FieldDropDown = ({
  fieldName,
  selectedField,
  selectedFieldIndex,
  onChange,
  attributes,
  mappedFields
}) => (
  <Select
    name="form-field-name"
    value={`${selectedField}:${selectedFieldIndex}`}
    onChange={data => onChange(fieldName, data ? data.value : null)}
    options={createOptions(attributes, mappedFields)}
  />
)

function mapStateToProps({ contacts }) {
  const { importCsv, attributeDefs } = contacts

  return {
    attributes: attributeDefs,
    mappedFields: importCsv.mappedFields
  }
}

export default connect(mapStateToProps)(FieldDropDown)
