import React from 'react'
import Select from 'react-select'
import pure from 'recompose/pure'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { change as updateField } from 'redux-form'

import Label from './Label'

const formName = 'filters'

const AsyncMultiSelect = ({
  name,
  label,
  onChange,
  loadOptions,
  placeholder,
  selectedOptions
}) =>
  <Label label={label}>
    <Select.Async
      multi
      name={name}
      onChange={onChange}
      value={selectedOptions}
      loadOptions={loadOptions}
      placeholder={placeholder}
      className="c-filters__select"
    />
  </Label>

export default compose(
  pure,
  connect(null, { updateField }),
  withState('selectedOptions', 'setSelectedOptions', []),
  withHandlers({
    onChange: ({ setSelectedOptions, updateField, name }) => options => {
      setSelectedOptions(options, () => {
        options =
          options.length === 0 ? null : options.map(({ label }) => label)
        updateField(formName, name, options)
      })
    }
  })
)(AsyncMultiSelect)
