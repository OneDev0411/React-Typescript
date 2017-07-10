import React from 'react'
import pure from 'recompose/pure'

import Tags from '../components/Tags'

const architectural_styles = {
  everything: 'Everything',
  mediterranean: 'Mediterranean',
  colonial: 'Colonial',
  loft: 'Loft',
  french: 'French',
  oriental: 'Oriental',
  midCentry_modern: 'Mid-Centry Modern',
  prairie: 'Prairie',
  ranch: 'Ranch',
  spanish: 'Spanish',
  split_level: 'Split Level',
  southwestern: 'Southwestern',
  studio_apartment: 'Studio Apartment',
  traditional: 'Traditional',
  tudor: 'Tudor',
  victorian: 'Victorian',
  aFrame: 'A-Frame',
  contemporary: 'Contemporary/Modern, Traditional'
}

const ArchitecturalStyles = () =>
  <Tags
    name="architectural_styles"
    label="Style of Home"
    fields={architectural_styles}
  />

export default pure(ArchitecturalStyles)
