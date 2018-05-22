import React, { Fragment } from 'react'
import { Form, Field } from 'react-final-form'
import _ from 'underscore'

import Modal from '../../../../../views/components/BasicModal'

import { TextInput } from '../../../../../views/components/Forms/TextInput'
import { SelectInput } from '../../../../../views/components/Forms/SelectInput'

import ActionButton from '../../../../../views/components/Button/ActionButton'
import CancelButton from '../../../../../views/components/Button/CancelButton'

import {
  stateToAbbreviated,
  STREET_SUFFIX,
  STREET_PREFIX,
  STATES
} from '../utils/address'
import Deal from '../../../../../models/Deal'

const defaultState = 'Texas'

export default class ManualAddress extends React.Component {
  /**
   *
   */
  onClose = () => this.props.onHide()

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
    return ['street_name', 'city', 'state', 'postal_code']
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

    return value && value.length > 0
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

    if (deal.listing) {
      return deal.mls_context[field] || defaultValue
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
      state,
      unit_number,
      postal_code
    } = values

    const full_address = [
      street_number || '',
      street_name || '',
      unit_number ? `, Unit ${unit_number},` : '',
      city ? `, ${city}` : '',
      state ? `, ${state}` : '',
      postal_code ? `, ${postal_code}` : ''
    ]
      .join(' ')
      .trim()
      .replace(/(\s)+,/gi, ',')
      .replace(/,,/gi, ',')

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
      full_address
    }
  }

  render() {
    const { show, deal, saving } = this.props

    return (
      <Modal
        isOpen={show}
        shouldCloseOnOverlayClick={false}
        handleOnClose={this.onClose}
      >
        <Modal.Header title="Address" showClose handleOnClose={this.onClose} />
        <Form
          onSubmit={this.onSubmit}
          validate={this.validate}
          initialValues={this.getInitialValues()}
          render={({ handleSubmit }) => (
            <Fragment>
              <Modal.Body
                className="u-scrollbar--thinner"
                style={{ padding: 0 }}
              >
                <Field
                  name="street_dir_prefix"
                  component={({ meta, input }) => (
                    <SelectInput
                      input={input}
                      meta={meta}
                      clearable
                      placeholder="Street Prefix"
                      onChange={data =>
                        input.onChange(data ? data.value : null)
                      }
                      options={STREET_PREFIX.map(value => ({
                        value,
                        label: value
                      }))}
                    />
                  )}
                />

                <Field
                  name="street_suffix"
                  component={({ meta, input }) => (
                    <SelectInput
                      input={input}
                      meta={meta}
                      clearable
                      searchable
                      placeholder="Street Suffix"
                      onChange={data =>
                        input.onChange(data ? data.value : null)
                      }
                      options={STREET_SUFFIX.map(value => ({
                        value,
                        label: value
                      }))}
                    />
                  )}
                />

                <Field
                  name="street_number"
                  placeholder="Street #"
                  isRequired={false}
                  component={TextInput}
                />

                <Field
                  name="street_name"
                  placeholder="Street Name"
                  isRequired
                  component={TextInput}
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
                  component={({ meta, input }) => (
                    <SelectInput
                      input={input}
                      meta={meta}
                      isRequired
                      clearable
                      searchable
                      placeholder="State"
                      onChange={data =>
                        input.onChange(data ? data.value : null)
                      }
                      options={_.map(STATES, name => ({
                        value: name,
                        label: name
                      }))}
                    />
                  )}
                />

                <Field
                  name="postal_code"
                  placeholder="Zipcode"
                  isRequired
                  component={TextInput}
                />
              </Modal.Body>

              <Modal.Footer>
                <CancelButton
                  disabled={saving}
                  onClick={this.onClose}
                  style={{
                    marginRight: '10px'
                  }}
                >
                  Cancel
                </CancelButton>

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
