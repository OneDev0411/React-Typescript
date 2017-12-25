import React from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { change as updateField, formValueSelector } from 'redux-form'

import Label from './Label'

const formName = 'filters'
const selector = formValueSelector(formName)

const AsyncMultiSelect = ({
  label,
  onChange,
  fieldName,
  loadOptions,
  placeholder,
  updateField,
  selectedOptions
}) => (
  <Label label={label}>
    <Select.Async
      multi
      name={fieldName}
      value={selectedOptions}
      loadOptions={loadOptions}
      placeholder={placeholder}
      className="c-filters__select"
      onChange={options => {
        updateField(formName, fieldName, options)
      }}
    />
  </Label>
)

export default compose(
  connect(
    (state, { fieldName }) => ({
      selectedOptions: selector(state, fieldName) || []
    }),
    { updateField }
  )
)(AsyncMultiSelect)
