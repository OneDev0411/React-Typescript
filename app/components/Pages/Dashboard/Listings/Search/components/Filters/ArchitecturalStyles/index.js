import React from 'react'
import pure from 'recompose/pure'

import Tags from '../components/Tags'

const architectural_styles = {
  mediterranean: 'Mediterranean',
  colonial: 'Colonial',
  oriental: 'Oriental',
  midCentry_modern: 'Mid-Centry Modern',
  prairie: 'Prairie',
  tudor: 'Tudor',
  southwestern: 'Southwestern',
  ranch: 'Ranch',
  spanish: 'Spanish',
  studio_apartment: 'Studio Apartment',
  traditional: 'Traditional',
  loft: 'Loft',
  split_level: 'Split Level',
  french: 'French',
  aFrame: 'A-Frame',
  victorian: 'Victorian',
  contemporary: 'Contemporary/Modern, Traditional'
}

const ArchitecturalStyles = () =>
  <Tags
    name="architectural_styles"
    label="Style of Home"
    fields={architectural_styles}
  />

export default pure(ArchitecturalStyles)
