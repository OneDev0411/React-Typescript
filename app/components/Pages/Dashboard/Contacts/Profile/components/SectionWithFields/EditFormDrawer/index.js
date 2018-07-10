import React from 'react'
import PropTypes from 'prop-types'

import { FinalFormDrawer } from '../../../../../../../../views/components/FinalFormDrawer'

import { Select } from './fields/Select'
import { TextField } from './fields/TextField'
import { MultiField } from './fields/MultiField'

import { getInitialValues, getPlaceholder, getValidator } from './helpers'

EditForm.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  validate: PropTypes.func
}

EditForm.defaultPorps = {
  validate: () => ({})
}

export function EditForm({ fields, ...props }) {
  return (
    <FinalFormDrawer
      {...props}
      initialValues={getInitialValues(fields)}
      render={({ form }) => getAllFields(fields, form.mutators)}
    />
  )
}

const getAllFields = (attributes, mutators) => {
  let allFields = []

  attributes.forEach((attribute, index) => {
    const { attribute_def } = attribute

    if (!attribute_def.show) {
      return
    }

    const key = `${attribute_def.section}_modal__${attribute_def.id}`
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
        c => c.props.attribute.attribute_def.id === attribute_def.id
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
