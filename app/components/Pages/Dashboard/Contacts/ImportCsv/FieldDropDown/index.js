import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'
import { isAddressField, getAddressFields } from '../helpers/address'

import DropDown from '../components/DropDown'

import ActionButton from '../../../../../../views/components/Button/ActionButton'

import { fieldsOrder as partnerFieldsName } from '../../Profile/Partner'

class FieldDropDown extends React.Component {
  /**
   * returns last address index in the map object
   * @param {Object} attributes - all attributes definitions
   * @param {Object} mappedFields - list of mapped fields
   */
  getLastAddressIndex = (attributes, mappedFields) => {
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
   * @param {Integer} max - last address index
   */
  createNewAddressOptions = (attributes, max) => {
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
   * checks whether an option is disabled or not
   * mapped address fileds should be disabled
   * @param {Object} attributes - all attributes definitions
   * @param {Object} mappedFields - list of mapped fields
   * @param {Integer} definitionId - attribute definition id
   * @param {Integer} index - the option index
   */
  isOptionDisabled = (attributes, mappedFields, definitionId, index) => {
    const { singular } = attributes.byId[definitionId]

    if (!isAddressField(attributes, definitionId) && !singular) {
      return false
    }

    return _.some(mappedFields, field => {
      if (singular && field.definitionId === definitionId) {
        return true
      }

      return definitionId === field.definitionId && index === field.index
    })
  }

  getPartnerOptions = () =>
    partnerFieldsName.map(name => {
      const definition = selectDefinitionByName(this.props.attributes, name)

      return {
        is_partner: true,
        label: `Spouse/Partner - ${definition.label}`,
        value: `${definition.id}:partner`
      }
    })

  /**
   * create field options based on indexing system
   * @param {Object} attributes - all attributes definitions
   * @param {Object} mappedFields - list of mapped fields
   */
  createOptions = (attributes, mappedFields) => {
    let newOptions = {}
    const lastAddressIndex = this.getLastAddressIndex(attributes, mappedFields)

    if (lastAddressIndex > 0) {
      newOptions = this.createNewAddressOptions(attributes, lastAddressIndex)
    }

    const primaryContactOptions = _.chain({ ...attributes.byId, ...newOptions })
      .filter(attr => attr.editable || attr.show)
      .map(({ id, label, index = 0 }) => ({
        disabled: this.isOptionDisabled(attributes, mappedFields, id, index),
        value: `${id}:${index}`,
        label: index > 0 ? `${label} ${index}` : label
      }))
      .value()

    return [...primaryContactOptions, ...this.getPartnerOptions()]
  }

  /**
   *
   */
  getSelectedField = options => {
    const {
      selectedField: { index, definitionId, is_partner }
    } = this.props

    const value =
      definitionId || index
        ? `${definitionId}:${is_partner ? 'partner' : index}`
        : ''

    const field =
      definitionId &&
      _.find(options, {
        value
      })

    return {
      value,
      label: field ? field.label : ''
    }
  }

  /**
   *
   */
  onFieldChange = value => {
    this.props.onChange(this.props.fieldName, value)
  }

  render() {
    const { attributes, mappedFields } = this.props

    const options = this.createOptions(attributes, mappedFields)
    const selectedField = this.getSelectedField(options)

    return (
      <div>
        <DropDown
          options={options}
          selectedField={selectedField}
          onChange={this.onFieldChange}
          callToActions={
            <ActionButton
              size="small"
              data-field={this.props.fieldName}
              onClick={this.props.toggleOpenDrawer}
            >
              Add custom field
            </ActionButton>
          }
        />
      </div>
    )
  }
}

function mapStateToProps({ contacts }) {
  return {
    attributes: contacts.attributeDefs,
    mappedFields: contacts.importCsv.mappedFields
  }
}

export default connect(mapStateToProps)(FieldDropDown)
