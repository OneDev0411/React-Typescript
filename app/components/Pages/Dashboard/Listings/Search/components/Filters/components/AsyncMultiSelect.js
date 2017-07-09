import React from 'react'
import Select from 'react-select'
import pure from 'recompose/pure'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import MultiSelect from './MultiSelect'

const AsyncMultiSelect = ({
  name,
  label,
  onChange,
  loadOptions,
  placeholder,
  selectedOptions
}) =>
  <MultiSelect
    label={label}
  >
    <Select.Async
      multi
      name={name}
      onChange={onChange}
      value={selectedOptions}
      loadOptions={loadOptions}
      placeholder={placeholder}
      className="c-filters__select"
    />
  </MultiSelect>

export default compose(
  pure,
  withState('selectedOptions', 'setSelectedOptions', []),
  withHandlers({
    onChange: ({
      setSelectedOptions
    }) => options => {
      setSelectedOptions(options)
    }
  })
)(AsyncMultiSelect)
