import React, { Fragment } from 'react'
import { Form, Field } from 'react-final-form'
import _ from 'underscore'

import { Modal } from 'react-bootstrap'

import { getField } from 'models/Deal/helpers/context'

import { TextInput } from 'components/Forms/TextInput'
import { SelectInput } from 'components/Forms/SelectInput'

import ActionButton from 'components/Button/ActionButton'

import {
  stateToAbbreviated,
  STREET_SUFFIX,
  STREET_PREFIX,
  STATES
} from '../utils/address'

const defaultState = 'Texas'

export default class ManualAddress extends React.Component {
  /**
   *
   */
  onClose = () => this.props.onClose()

  /**
   *
   */
  onSubmit = values =>
    this.props.onCreateAddress({
      type: 'listing',
      address_components: this.getAddressComponent(values)
    })

  /**
   *
   */
  get RequiredFields() {
    return ['street_name', 'street_number', 'city', 'state', 'postal_code']
  }

  /**
   *
   */
  getInitialValues = () => {
    const { deal, saving } = this.props

    if (saving) {
      return this.form
    }

    this.form = {
      street_suffix: this.getAddressField(deal, 'street_suffix'),
      street_dir_prefix: this.getAddressField(deal, 'street_dir_prefix'),
      street_number: this.getAddressField(deal, 'street_number'),
      street_name: this.getAddressField(deal, 'street_name'),
      unit_number: this.getAddressField(deal, 'unit_number'),
      city: this.getAddressField(deal, 'city'),
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
  getAddressField = (deal, field, defaultValue = '') => {
    if (!deal) {
      return defaultValue
    }

    return getField(deal, field) || defaultValue
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
      state,
      state_code: stateToAbbreviated(state),
      postal_code,
      full_address,
      street_address
    }
  }

  render() {
    const { show, deal, saving } = this.props

    return (
      <Modal show={show} backdrop="static" onHide={this.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Address</Modal.Title>
        </Modal.Header>

        <Form
          onSubmit={this.onSubmit}
          validate={this.validate}
          initialValues={this.getInitialValues()}
          render={({ handleSubmit }) => (
            <Fragment>
              <Modal.Body
                className="u-scrollbar--thinner"
                style={{ padding: '0 2%' }}
              >
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
                  placeholder="Street #"
                  isRequired
                  component={TextInput}
                />

                <Field
                  name="street_name"
                  placeholder="Street Name"
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
                  placeholder="Apartment/Unit Number"
                  isRequired={false}
                  component={TextInput}
                />

                <Field
                  name="city"
                  placeholder="City"
                  isRequired
                  component={TextInput}
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
                  placeholder="Zipcode"
                  isRequired
                  component={TextInput}
                />
              </Modal.Body>

              <Modal.Footer>
                <ActionButton
                  appearance="outline"
                  disabled={saving}
                  onClick={this.onClose}
                  style={{
                    marginRight: '1em'
                  }}
                >
                  Cancel
                </ActionButton>

                <ActionButton
                  disabled={saving}
                  onClick={() => handleSubmit(this.onSubmit)}
                >
                  {deal ? 'Update Address' : 'Add'}
                </ActionButton>
              </Modal.Footer>
            </Fragment>
          )}
        />
      </Modal>
    )
  }
}
