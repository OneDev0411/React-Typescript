import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Field } from 'react-final-form'
import _ from 'underscore'

import Deal from 'models/Deal'
import DealContext from 'models/Deal/helpers/dynamic-context'

import { upsertContexts } from 'actions/deals'

import { TextInput } from 'components/Forms/TextInput'

import { SelectInput } from '../../../../../../views/components/Forms/SelectInput'

import { FinalFormDrawer } from '../../../../../../views/components/FinalFormDrawer'

import {
  stateToAbbreviated,
  COUNTIES,
  STREET_SUFFIX,
  STREET_PREFIX,
  STATES
} from '../../utils/address'

const defaultState = 'Texas'

class Address extends React.Component {
  state = {
    isSavingAddress: false
  }

  /**
   *
   */
  onSubmit = values =>
    this.onCreateAddress({
      type: 'listing',
      address_components: this.getAddressComponent(values)
    })

  /**
   *
   */
  get RequiredFields() {
    return ['street_name', 'city', 'state', 'postal_code']
  }

  /**
   *
   */
  get InitialValues() {
    const { deal } = this.props

    if (this.state.isSavingAddress) {
      return this.form
    }

    this.form = {
      street_suffix: this.getAddressField(deal, 'street_suffix'),
      street_dir_prefix: this.getAddressField(deal, 'street_dir_prefix'),
      street_number: this.getAddressField(deal, 'street_number'),
      street_name: this.getAddressField(deal, 'street_name'),
      unit_number: this.getAddressField(deal, 'unit_number'),
      city: this.getAddressField(deal, 'city'),
      county: this.getAddressField(deal, 'county'),
      state: this.getAddressField(deal, 'state', defaultState),
      postal_code: this.getAddressField(deal, 'postal_code')
    }

    return this.form
  }

  /**
   *
   */
  validate = values => {
    const errors = {}

    this.RequiredFields.forEach(fieldName => {
      if (!values[fieldName]) {
        errors[fieldName] = 'Required'
      }
    })

    _.each(values, async (fieldValue, fieldName) => {
      const validator = this.FormValidators[fieldName]

      if (!validator) {
        return false
      }

      if (!errors[fieldName] && !validator(fieldValue, fieldName)) {
        errors[fieldName] = this.ErrorNames[fieldName] || 'Invalid'
      }
    })

    return errors
  }

  /**
   *
   */
  get FormValidators() {
    return {
      street_number: this.isValidString,
      street_name: this.isValidString,
      unit_number: this.isValidString,
      city: this.isValidString,
      county: this.isValidCounty,
      state: this.isValidState,
      postal_code: this.isValidPostalCode
    }
  }

  /**
   *
   */
  get ErrorNames() {
    return {
      postal_code: 'Enter a valid zipcode',
      state: 'Select State'
    }
  }

  /**
   *
   */
  isValidString = (value, fieldName) => {
    if (!value && !this.RequiredFields[fieldName]) {
      return true
    }

    return value && value.trim().length > 0
  }

  /**
   *
   */
  isValidPostalCode = value => /(^\d{4,}$)/.test(value)

  /**
   *
   */
  isValidState = value => _.some(STATES, name => name === value)

  /**
   *
   */
  isValidCounty = value => _.some(COUNTIES, name => name === value)

  /**
   *
   */
  getAddressField = (deal, field, defaultValue = '') => {
    if (!deal) {
      return defaultValue
    }

    return Deal.get.field(deal, field) || defaultValue
  }

  /**
   *
   */
  getAddressComponent = values => {
    const {
      street_dir_prefix,
      street_suffix,
      street_number,
      street_name,
      city,
      county,
      state,
      unit_number,
      postal_code
    } = values

    const full_address = [
      street_number || '',
      street_dir_prefix || '',
      street_name || '',
      street_suffix || '',
      unit_number ? `, Unit ${unit_number},` : '',
      city ? `, ${city}` : '',
      county ? `, ${county}` : '',
      state ? `, ${state}` : '',
      postal_code ? `, ${postal_code}` : ''
    ]
      .join(' ')
      .trim()
      .replace(/(\s)+,/gi, ',')
      .replace(/,,/gi, ',')

    const street_address = [
      street_number || '',
      street_dir_prefix || '',
      street_name || '',
      street_suffix || '',
      unit_number ? ` Unit ${unit_number}` : ''
    ]
      .join(' ')
      .trim()

    return {
      street_dir_prefix,
      street_suffix,
      street_number,
      street_name,
      unit_number,
      city,
      county,
      state,
      state_code: stateToAbbreviated(state),
      postal_code,
      full_address,
      street_address
    }
  }

  onCreateAddress = async address => {
    const { address_components } = address

    if (this.props.onCreateAddress) {
      return this.props.onCreateAddress(address)
    }

    this.setState({
      isSavingAddress: true
    })

    const contexts = []

    _.each(address_components, (value, name) => {
      contexts.push({
        definition: DealContext.getDefinitionId(this.props.deal.brand.id, name),
        checklist: DealContext.getChecklist(this.props.deal, name),
        value: address_components[name],
        approved: true // none of address contexts, don't need admin approval
      })
    })

    const newDeal = await this.props.upsertContexts(
      this.props.deal.id,
      contexts
    )

    this.setState({
      isSavingAddress: false
    })

    this.props.onClose(newDeal, address)
  }

  render() {
    const { deal } = this.props

    return (
      <FinalFormDrawer
        formId="deal-address-form"
        initialValues={this.InitialValues}
        title="Address"
        isOpen={this.props.show}
        onClose={this.props.onClose}
        reinitializeAfterSubmit={false}
        onSubmit={this.onSubmit}
        validate={this.validate}
        submitting={this.state.isSavingAddress}
        submitLabel={deal ? 'Update Address' : 'Add'}
        showReset={false}
        render={() => (
          <Fragment>
            <Field
              name="street_dir_prefix"
              clearable
              placeholder="Street Prefix"
              options={STREET_PREFIX.map(value => ({
                value,
                label: value
              }))}
              component={SelectInput}
            />

            <Field
              name="street_number"
              labelText="Street #"
              isRequired={false}
              component={TextInput}
            />

            <Field
              name="street_name"
              labelText="Street Name"
              isRequired
              component={TextInput}
            />

            <Field
              name="street_suffix"
              clearable
              searchable
              placeholder="Street Suffix"
              options={STREET_SUFFIX.map(value => ({
                value,
                label: value
              }))}
              component={SelectInput}
            />

            <Field
              name="unit_number"
              labelText="Apartment/Unit Number"
              isRequired={false}
              component={TextInput}
            />

            <Field
              name="city"
              labelText="City"
              isRequired
              component={TextInput}
            />

            <Field
              name="county"
              searchable
              clearable
              isRequired
              placeholder="County"
              options={_.map(COUNTIES, name => ({
                value: name,
                label: name
              }))}
              component={SelectInput}
            />

            <Field
              name="state"
              searchable
              clearable
              isRequired
              placeholder="State"
              options={_.map(STATES, name => ({
                value: name,
                label: name
              }))}
              component={SelectInput}
            />

            <Field
              name="postal_code"
              labelText="Zipcode"
              isRequired
              component={TextInput}
            />
          </Fragment>
        )}
      />
    )
  }
}

export default connect(
  null,
  { upsertContexts }
)(Address)
