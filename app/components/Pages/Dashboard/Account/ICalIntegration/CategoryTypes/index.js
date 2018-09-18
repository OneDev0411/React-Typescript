import React from 'react'

import RadioButton from '../../../../../../views/components/RadioButton'
import { SectionTitle } from '../styled'

const CategoryTypes = ({
  title,
  types,
  selectedTypes,
  onChangeSelectedTypes
}) => (
  <div style={{ marginBottom: '2em' }}>
    <SectionTitle>{title}</SectionTitle>
    {types.map(type => (
      <RadioButton
        square
        key={type.name}
        selected={selectedTypes.includes(type.name)}
        title={type.label}
        onClick={() => onChangeSelectedTypes(type.name)}
        style={{ display: 'block', marginBottom: '2rem' }}
      />
    ))}
  </div>
)
export default CategoryTypes
