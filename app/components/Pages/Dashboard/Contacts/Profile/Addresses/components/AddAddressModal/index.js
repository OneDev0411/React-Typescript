import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Form, Field } from 'react-final-form'

import BasicModal from '../../../../../../../../views/components/BasicModal'
import ActionButton from '../../../../../../../../views/components/Button/ActionButton'
import TextField from './TextField'
import Dropdown from '../../../../components/Dropdown'

import { getAddressLabels } from '../../../../../../../../models/contacts/helpers/get-attribute-labels'

const isPostalCode = value =>
  !value || new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/).exec(value)
    ? undefined
    : 'Please include numbers. You have added a letter or special character.'

// const composeValidators = (...validators) => value =>
//   validators.reduce((error, validator) => error || validator(value), undefined)

const validate = values => {
  const errors = {}

  if (!values.street_name) {
    errors.street_name = 'Required'
  }

  if (!values.city) {
    errors.city = 'Required'
  }

  const postal_code = isPostalCode(values.postal_code)

  if (postal_code) {
    errors.postal_code = postal_code
  }

  return errors
}

function AddAddressModal({
  isOpen,
  submitting,
  attributeDefs,
  handleOnClose,
  handleOnSubmit
}) {
  return (
    <BasicModal
      isOpen={isOpen}
      handleOnClose={handleOnClose}
      className="c-new-address-modal"
    >
      <Form
        validate={validate}
        onSubmit={handleOnSubmit}
        initialValues={{ label: 'Other' }}
        render={({ reset, values, pristine, validating, handleSubmit }) => (
          <Fragment>
            <BasicModal.Header title="Add New Address" />
            <BasicModal.Body className="c-new-address-modal__body">
              <div
                style={{
                  display: 'flex',
                  marginBottom: '1em',
                  alignItems: 'center'
                }}
              >
                <div className="c-new-address-modal__field--inline">
                  <Field name="is_primary">
                    {({ input }) => (
                      <span>
                        <input
                          {...input}
                          value="yes"
                          id="add-new-address__isPrimary"
                          type="checkbox"
                        />
                        <label
                          htmlFor="add-new-address__isPrimary"
                          style={{ marginLeft: '.5em' }}
                          className="c-new-address-modal__field__label"
                        >
                          Set as primary address
                        </label>
                      </span>
                    )}
                  </Field>
                </div>
                <div className="c-new-address-modal__field--inline">
                  <Field name="label">
                    {({ input: { onChange } }) => (
                      <span>
                        <label
                          style={{ marginRight: '1em' }}
                          className="c-new-address-modal__field__label"
                        >
                          Label:
                        </label>
                        <Dropdown
                          name="add-new-address_label"
                          options={getAddressLabels(attributeDefs)}
                          disabled={submitting}
                          defaultTitle={values.label}
                          handleOnSelect={value => onChange(value)}
                        />
                      </span>
                    )}
                  </Field>
                </div>
              </div>

              <Field
                name="unit_number"
                component={TextField}
                disabled={submitting}
                title="Unit Number"
              />

              <Field
                name="street_number"
                component={TextField}
                disabled={submitting}
                title="Street Number"
              />
              <Field
                name="street_prefix"
                component={TextField}
                disabled={submitting}
                title="Street Prefix"
              />
              <Field
                name="street_name"
                isRequired
                component={TextField}
                disabled={submitting}
                title="Street Name"
              />
              <Field
                name="street_suffix"
                component={TextField}
                disabled={submitting}
                title="Street Suffix"
              />

              <Field
                name="zip_code"
                component={TextField}
                disabled={submitting}
                title="Zip Code"
                placeholder="65619 or 34353-2323"
              />

              <Field
                name="city"
                isRequired
                component={TextField}
                disabled={submitting}
                title="City"
              />

              <Field
                name="state"
                component={TextField}
                disabled={submitting}
                title="State"
              />

              <Field
                name="country"
                component={TextField}
                disabled={submitting}
                title="Country"
              />
            </BasicModal.Body>
            <BasicModal.Footer style={{ justifyContent: 'space-between' }}>
              <div>
                <button
                  disabled={submitting}
                  onClick={handleOnClose}
                  className="c-new-address-modal__cancel-btn"
                >
                  Cancel
                </button>
              </div>
              <div>
                <ActionButton
                  onClick={reset}
                  style={{ marginRight: '1em' }}
                  disabled={submitting || pristine}
                >
                  Reset
                </ActionButton>
                <ActionButton
                  disabled={submitting || validating}
                  onClick={() => handleSubmit(handleOnSubmit)}
                >
                  {submitting ? 'Adding ...' : 'Add'}
                </ActionButton>
              </div>
            </BasicModal.Footer>
          </Fragment>
        )}
      />
    </BasicModal>
  )
}

function mapStateToProps({ contacts }) {
  return { attributeDefs: contacts.attributeDefs }
}

export default connect(mapStateToProps)(AddAddressModal)
