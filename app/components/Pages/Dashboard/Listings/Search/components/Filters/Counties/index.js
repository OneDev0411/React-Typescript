import React from 'react'
import pure from 'recompose/pure'
import Select from 'react-select'

import AsyncMultiSelect from '../components/AsyncMultiSelect'
import api from '../../../../../../../../models/listings/search'

const Counties = () => (
  <AsyncMultiSelect
    label="Counties"
    fieldName="counties"
    loadOptions={api.getCounties}
    placeholder="type in county name..."
  />
)

export default pure(Counties)
