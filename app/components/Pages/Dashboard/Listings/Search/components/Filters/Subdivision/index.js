import React from 'react'
import pure from 'recompose/pure'
import Select from 'react-select'

import AsyncMultiSelect from '../components/AsyncMultiSelect'
import api from '../../../../../../../../models/listings/search'

const Subdivisions = () =>
  <AsyncMultiSelect
    name="subdivisions"
    label="Subdivisions"
    placeholder="Subdivision name..."
    loadOptions={api.getSubdivisions}
  />

export default pure(Subdivisions)
