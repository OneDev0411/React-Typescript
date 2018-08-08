import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import CustomAttributeDrawer from '../../components/CustomAttributeDrawer'

import { selectDefinitionByName } from '../../../../../../reducers/contacts/attributeDefs'
import { isAddressField, getAddressFields } from '../helpers/address'

import DropDown from '../components/DropDown'

import ActionButton from '../../../../../../views/components/Button/ActionButton'

class FieldDropDown extends React.Component {
  state = {
    isDrawerOpen: false
  }

  toggleOpenDrawer = () =>
    this.setState(state => ({
      isDrawerOpen: !state.isDrawerOpen
    }))

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

    const options = {
      ...attributes.byId,
      ...newOptions
    }

    return _.chain(options)
      .filter(
        attr => !['stage'].includes(attr.name) && (attr.editable || attr.show)
      )
      .map(({ id, label, singular, index = 0 }) => ({
        disabled: this.isOptionDisabled(attributes, mappedFields, id, index),
        value: `${id}:${index}`,
        label: index > 0 ? `${label} ${index}` : label
      }))
      .value()
  }

  /**
   *
   */
  getSelectedField = options => {
    const { selectedField, selectedFieldIndex } = this.props
    const value =
      selectedField || selectedFieldIndex
        ? `${selectedField}:${selectedFieldIndex}`
        : ''

    const field =
      selectedField &&
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
            <ActionButton onClick={this.toggleOpenDrawer}>
              Add custom field
            </ActionButton>
          }
        />

        <CustomAttributeDrawer
          isOpen={this.state.isDrawerOpen}
          onClose={this.toggleOpenDrawer}
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
