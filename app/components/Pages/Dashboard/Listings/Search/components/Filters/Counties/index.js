import React from 'react'

import api from '../../../../../../../../models/listings/search'
import AsyncMultiSelect from '../components/AsyncMultiSelect'

const Counties = () => (
  <AsyncMultiSelect
    label="Counties"
    fieldName="counties"
    loadOptions={api.getCounties}
    placeholder="type in county name..."
  />
)

export default Counties
