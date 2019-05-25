import React from 'react'

import { SelectInput } from 'components/Forms/SelectInput'

const items = [null, 'Mr', 'Ms', 'Mrs', 'Miss', 'Dr'].map(value => ({
  value,
  label: value || 'Select Title'
}))

export function TitleInput(props) {
  if (!props.isVisible) {
    return false
  }

  const selectedItem = props.input.value
    ? items.find(item => item.value === props.input.value)
    : items[0]

  return (
    <SelectInput
      style={{
        width: '20%',
        marginRight: '0.5rem'
      }}
      dropdownStyle={{
        borderBottom: '1px solid #dce5eb',
        height: '2rem',
        paddingBottom: '0.25rem'
      }}
      searchable={false}
      clearable
      input={props.input}
      meta={props.meta}
      label="Title"
      items={items}
      selectedItem={selectedItem}
      defaultSelectedItem={selectedItem}
      dropdownOptions={{
        fullHeight: true
      }}
    />
  )
}
