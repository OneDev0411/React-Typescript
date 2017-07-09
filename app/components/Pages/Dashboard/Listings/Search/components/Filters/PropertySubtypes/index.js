import React from 'react'
import pure from 'recompose/pure'

import Tags from '../components/Tags'

const property_subtypes = {
  condo: 'RES-Condo',
  farm: 'RES-Farm/Ranch',
  duples: 'RES-Half Duplex',
  townhouse: 'RES-Townhouse',
  single_family: 'RES-Single Family'
}

const PropertySubtypes = () =>
  <Tags
    name="property_subtypes"
    label="Property Subtypes"
    fields={property_subtypes}
  />

export default pure(PropertySubtypes)