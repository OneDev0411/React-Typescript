import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

import { isEmail } from '../../../utils/validations'

import BasicModal from '../BasicModal'
import ActionButton from '../Button/ActionButton'

import { Select } from './fields/Select'
import { TextField } from './fields/TextField'
import { MultiField } from './fields/MultiField'

import { getInitialValues } from './helpers'

const validators = {
  email: isEmail
}

FinalFormModal.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  validate: PropTypes.func
}

FinalFormModal.defaultPorps = {
  validate: () => ({})
}

export function FinalFormModal({
  fields,
  isOpen,
  onClose,
  onSubmit,
  submitting,
  title,
  validate
}) {
  return (
    <BasicModal
      isOpen={isOpen}
      handleOnClose={onClose}
      className="c-new-address-modal"
    >
      <Form
        validate={validate}
        onSubmit={onSubmit}
        mutators={{ ...arrayMutators }}
        initialValues={getInitialValues(fields)}
        render={({ form, pristine, validating, handleSubmit }) => (
          <Fragment>
            <BasicModal.Header title={title} />
            <BasicModal.Body style={{ padding: 0 }}>
              {getAllFields(fields, form.mutators)}
            </BasicModal.Body>
            <BasicModal.Footer style={{ justifyContent: 'space-between' }}>
              <div>
                <button
                  disabled={submitting}
                  onClick={onClose}
                  className="c-new-address-modal__cancel-btn"
                >
                  Cancel
                </button>
              </div>
              <div>
                <ActionButton
                  onClick={() => form.reset(getInitialValues(fields))}
                  style={{ marginRight: '1em' }}
                  disabled={submitting || pristine}
                >
                  Reset
                </ActionButton>
                <ActionButton
                  disabled={submitting || validating}
                  onClick={() => handleSubmit(onSubmit)}
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

const getAllFields = (fields, mutators) => {
  let allFields = []

  fields.forEach((field, index) => {
    const { attribute_def } = field

    if (!attribute_def.show) {
      return
    }

    const key = `${attribute_def.section}_modal__${attribute_def.name}`

    if (attribute_def.singular) {
      if (Array.isArray(attribute_def.enum_values)) {
        return allFields.push(<Select key={key} field={field} />)
      }

      return allFields.push(<TextField field={field} key={key} />)
    } else if (
      !allFields.some(
        c => c.props.field.attribute_def.name === attribute_def.name
      )
    ) {
      allFields.push(
        <MultiField
          field={field}
          key={`${key}_${index}`}
          mutators={mutators}
          validate={validators[field.attribute_def.name]}
        />
      )
    }
  })

  return allFields
}
