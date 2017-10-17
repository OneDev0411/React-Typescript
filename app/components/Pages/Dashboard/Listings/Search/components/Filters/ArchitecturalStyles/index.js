import React from 'react'
import pure from 'recompose/pure'

import Tags from '../components/Tags'

const architectural_styles = {
  southwestern: 'Southwestern',
  ranch: 'Ranch',
  spanish: 'Spanish',
  aFrame: 'A-Frame',
  midCentry_modern: 'Mid-Centry Modern',
  prairie: 'Prairie',
  studio_apartment: 'Studio Apartment',
  contemporary: 'Contemporary/Modern',
  split_level: 'Split Level',
  victorian: 'Victorian',
  traditional: 'Traditional',
  mediterranean: 'Mediterranean',
  colonial: 'Colonial',
  oriental: 'Oriental',
  loft: 'Loft',
  french: 'French',
  tudor: 'Tudor'
}

const ArchitecturalStyles = () => (
  <Tags
    name="architectural_styles"
    label="Style of Home"
    fields={architectural_styles}
  />
)

export default pure(ArchitecturalStyles)
