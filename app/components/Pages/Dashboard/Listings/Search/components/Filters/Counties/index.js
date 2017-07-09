import React from 'react'
import Select from 'react-select'
import compose from 'recompose/compose'
import lifecycle from 'recompose/lifecycle'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import MultiSelect from '../components/MultiSelect'
import api from '../../../../../../../../models/listings/search'

const Counties = ({
  onChange,
  selectedCounties
}) =>
  <MultiSelect
    label="Counties"
  >
    <Select.Async
      multi
      name="counties"
      onChange={onChange}
      value={selectedCounties}
      loadOptions={api.getCounties}
      placeholder="Counties #..."
      className="c-filters__select"
    />
  </MultiSelect>

export default compose(
  withState('selectedCounties', 'setSelectedCounties', []),
  withHandlers({
    onChange: ({
      setSelectedCounties
    }) => counties => {
      console.log(counties)
      setSelectedCounties(counties)
    }
  })
)(Counties)
