import React from 'react'
import { Form, Field } from 'react-final-form'

import BasicModal from '../../../../../../../../views/components/BasicModal'
import CancelButton from '../../../../../../../../views/components/Button/CancelButton'
import ActionButton from '../../../../../../../../views/components/Button/ActionButton'
import TextField from './TextField'
import { LABELS_OPTIONS } from '../../index'
import Dropdown from '../../../../components/Dropdown'

const required = value => (value ? undefined : 'Required')

const isPostalCode = value =>
  !value || new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/).exec(value)
    ? undefined
    : 'Please include numbers. You have added a letter or special character.'

// const composeValidators = (...validators) => value =>
//   validators.reduce((error, validator) => error || validator(value), undefined)

function AddAddressModal({
  isOpen,
  submitting,
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
        onSubmit={handleOnSubmit}
        initialValues={{ label: 'Other' }}
        render={({ handleSubmit, pristine, invalid, values, reset }) => (
          <div>
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
                          options={LABELS_OPTIONS}
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
                name="street_name"
                isRequired
                component={TextField}
                disabled={submitting}
                title="Street Name"
                placeholder="Buyers Club"
                validate={required}
              />

              <Field
                name="city"
                isRequired
                component={TextField}
                disabled={submitting}
                title="City"
                placeholder="Dallas"
                validate={required}
              />

              <Field
                name="state"
                component={TextField}
                disabled={submitting}
                title="State"
                placeholder="Texas"
              />

              <Field
                name="postal_code"
                component={TextField}
                disabled={submitting}
                title="Postal Code"
                placeholder="65619 or 34353-2323"
                validate={isPostalCode}
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
                  disabled={pristine || invalid}
                  onClick={() => handleSubmit(handleOnSubmit)}
                >
                  {submitting ? 'Adding ...' : 'Add'}
                </ActionButton>
              </div>
            </BasicModal.Footer>
          </div>
        )}
      />
    </BasicModal>
  )
}

export default AddAddressModal
