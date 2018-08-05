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
        key={type}
        selected={selectedTypes.includes(type)}
        title={type}
        onClick={() => onChangeSelectedTypes(type)}
        style={{ display: 'block', marginTop: '2rem' }}
      />
    ))}
  </div>
)
export default CategoryTypes
