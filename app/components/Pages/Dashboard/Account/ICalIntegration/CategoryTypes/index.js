import React from 'react'
import RadioButton from '../../../../../../views/components/radio'

import { TypesHeader } from './styled'

const CategoryTypes = ({
  title,
  types,
  selectedTypes,
  onChangeSelectedTypes
}) => (
  <div>
    <TypesHeader>{title}</TypesHeader>
    {types.map(type => (
      <RadioButton
        square
        key={type.name}
        selected={selectedTypes.includes(type.name)}
        title={type.label}
        onClick={() => onChangeSelectedTypes(type.name)}
        style={{ display: 'block', marginTop: '2rem' }}
      />
    ))}
  </div>
)
export default CategoryTypes
