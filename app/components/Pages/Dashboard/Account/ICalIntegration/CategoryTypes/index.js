import React from 'react'
import Flex from 'styled-flex-component'

import { SectionTitle } from '../styled'
import { CheckBoxButton } from '../../../../../../views/components/Button/CheckboxButton'

const CategoryTypes = ({
  title,
  types,
  selectedTypes,
  onChangeSelectedTypes,
  onSelectOneCategoriesTypes
}) => {
  const allSelected = types.every(type => selectedTypes.includes(type.name))

  return (
    <div style={{ marginBottom: '2em' }}>
      <SectionTitle>{title}</SectionTitle>
      <Flex alignCenter style={{ marginBottom: '2rem' }}>
        <CheckBoxButton
          square
          isSelected={allSelected}
          onClick={() =>
            onSelectOneCategoriesTypes(
              types.map(type => type.name),
              allSelected
            )
          }
          style={{ marginRight: '0.5rem' }}
        />
        All
      </Flex>
      {types.map(type => (
        <Flex alignCenter key={type.name} style={{ marginBottom: '2rem' }}>
          <CheckBoxButton
            square
            key={type.name}
            isSelected={selectedTypes.includes(type.name)}
            onClick={() => onChangeSelectedTypes(type.name)}
            style={{ marginRight: '0.5rem' }}
          />
          {type.label}
        </Flex>
      ))}
    </div>
  )
}
export default CategoryTypes
