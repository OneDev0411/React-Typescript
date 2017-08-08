import React from 'react'
import pure from 'recompose/pure'

import Tags from '../components/Tags'

const PropertySubtypes = ({ fields }) =>
  <Tags name="property_subtypes" label="Property Subtypes" fields={fields} />

export default pure(PropertySubtypes)
