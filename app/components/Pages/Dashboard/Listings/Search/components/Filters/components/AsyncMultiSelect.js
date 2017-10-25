import React from 'react'
import Select from 'react-select'
import pure from 'recompose/pure'
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
  selectedOptions
}) => (
  <Label label={label}>
    <Select.Async
      multi
      name={fieldName}
      onChange={onChange}
      value={selectedOptions}
      loadOptions={loadOptions}
      placeholder={placeholder}
      className="c-filters__select"
    />
  </Label>
)

export default compose(
  pure,
  connect(
    (state, { fieldName }) => {
      const initialOptions = selector(state, fieldName) || []

      return {
        initialOptions
      }
    },
    { updateField }
  ),
  withState(
    'selectedOptions',
    'setSelectedOptions',
    ({ initialOptions }) => initialOptions
  ),
  withHandlers({
    onChange: ({ setSelectedOptions, updateField, fieldName }) => (
      options = []
    ) => {
      setSelectedOptions(options, () =>
        updateField(formName, fieldName, options)
      )
    }
  })
)(AsyncMultiSelect)
