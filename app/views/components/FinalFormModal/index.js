import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'

import BasicModal from '../BasicModal'
import ActionButton from '../Button/ActionButton'

import { Select } from './fields/Select'
import { TextField } from './fields/TextField'
import { MultiField } from './fields/MultiField'

import { getInitialValues, getPlaceholder, getValidator } from './helpers'

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
    <BasicModal isOpen={isOpen} handleOnClose={onClose} title={title}>
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
                  type="button"
                  disabled={submitting}
                  onClick={onClose}
                  className="c-new-address-modal__cancel-btn"
                >
                  Cancel
                </button>
              </div>
              <div>
                <ActionButton
                  type="button"
                  onClick={() => form.reset(getInitialValues(fields))}
                  style={{ marginRight: '1em' }}
                  disabled={submitting || pristine}
                >
                  Reset
                </ActionButton>
                <ActionButton
                  type="button"
                  disabled={submitting || validating}
                  onClick={() => handleSubmit(onSubmit)}
                >
                  {submitting ? 'Saving ...' : 'Save'}
                </ActionButton>
              </div>
            </BasicModal.Footer>
          </Fragment>
        )}
      />
    </BasicModal>
  )
}

const getAllFields = (attributes, mutators) => {
  let allFields = []

  attributes.forEach((attribute, index) => {
    const { attribute_def } = attribute

    if (!attribute_def.show) {
      return
    }

    const key = `${attribute_def.section}_modal__${attribute_def.name}`
    const placeholder = getPlaceholder(attribute)
    const validate = getValidator(attribute)

    if (attribute_def.singular) {
      if (attribute_def.enum_values) {
        return allFields.push(<Select key={key} attribute={attribute} />)
      }

      return allFields.push(
        <TextField
          attribute={attribute}
          key={key}
          placeholder={placeholder}
          validate={validate}
        />
      )
    } else if (
      !allFields.some(
        c => c.props.attribute.attribute_def.name === attribute_def.name
      )
    ) {
      allFields.push(
        <MultiField
          attribute={attribute}
          key={`${key}_${index}`}
          mutators={mutators}
          placeholder={placeholder}
          validate={validate}
        />
      )
    }
  })

  return allFields
}
