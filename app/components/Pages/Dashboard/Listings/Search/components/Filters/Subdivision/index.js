import React from 'react'

import api from '../../../../../../../../models/listings/search'
import AsyncMultiSelect from '../components/AsyncMultiSelect'

const Subdivisions = () => (
  <AsyncMultiSelect
    label="Subdivisions"
    fieldName="subdivisions"
    placeholder="Subdivision name..."
    loadOptions={api.getSubdivisions}
  />
)

export default Subdivisions
