import React from 'react'
import Flex from 'styled-flex-component'

import { SectionTitle } from '../styled'
import { CheckBoxButton } from '../../../../../../views/components/Button/CheckboxButton'

const CategoryTypes = ({
  title,
  types,
  selectedTypes,
  onChangeSelectedTypes
}) => (
  <div style={{ marginBottom: '2em' }}>
    <SectionTitle>{title}</SectionTitle>
    {types.map(type => (
      <Flex alignCenter key={type.name} style={{ marginBottom: '2rem' }}>
        <CheckBoxButton
          square
          key={type.name}
          isSelected={selectedTypes.includes(type.name)}
          title={type.label}
          onClick={() => onChangeSelectedTypes(type.name)}
          style={{ marginRight: '0.5rem' }}
        />
        {type.label}
      </Flex>
    ))}
  </div>
)
export default CategoryTypes
