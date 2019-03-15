import React from 'react'
import PropTypes from 'prop-types'

import { DateField, SelectField, TextField } from './fields'

Value.propTypes = {
  attribute: PropTypes.shape().isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string
}

Value.defaultProps = {
  placeholder: ''
}

export function Value(props) {
  const { attribute_def } = props.attribute

  const value = props.attribute[attribute_def.data_type]

  const _props = {
    value,
    onChange: props.onChange
  }

  if (attribute_def.data_type === 'date') {
    return <DateField {..._props} />
  }

  if (attribute_def.enum_values) {
    return <SelectField {..._props} items={attribute_def.enum_values} />
  }

  return <TextField {..._props} placeholder={props.placeholder} />
}
