import React from 'react'
import Select from 'react-select'

import AsyncMultiSelect from '../components/AsyncMultiSelect'
import api from '../../../../../../../../models/listings/search'

const Subdivisions = () => (
  <AsyncMultiSelect
    label="Subdivisions"
    fieldName="subdivisions"
    placeholder="Subdivision name..."
    loadOptions={api.getSubdivisions}
  />
)

export default Subdivisions
