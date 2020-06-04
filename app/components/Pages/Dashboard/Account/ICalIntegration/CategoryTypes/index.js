import React from 'react'

import { Checkbox } from 'components/Checkbox'

import Title from '../Title'

const CategoryTypes = ({
  title,
  types,
  selectedTypes,
  onChangeSelectedTypes,
  onSelectOneCategoriesTypes
}) => {
  const containerStyle = { display: 'flex', marginBottom: '2rem' }
  const allSelected = types.every(type => selectedTypes.includes(type.name))

  return (
    <div>
      <Title>{title}</Title>
      <Checkbox
        checked={allSelected}
        containerStyle={containerStyle}
        onChange={() =>
          onSelectOneCategoriesTypes(types.map(type => type.name), allSelected)
        }
      >
        All
      </Checkbox>
      {types.map(type => (
        <Checkbox
          key={type.name}
          containerStyle={containerStyle}
          checked={selectedTypes.includes(type.name)}
          onChange={() => onChangeSelectedTypes(type.name)}
        >
          {type.label}
        </Checkbox>
      ))}
    </div>
  )
}
export default CategoryTypes
