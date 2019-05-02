import React from 'react'

import { SelectInput } from 'components/Forms/SelectInput'

const items = [null, 'Mr', 'Ms', 'Mrs', 'Miss', 'Dr'].map(value => ({
  value,
  label: value || 'Select Title'
}))

export function TitleInput(props) {
  if (props.isVisible === false) {
    return false
  }

  return (
    <SelectInput
      style={{
        width: '20%',
        marginRight: '0.5rem'
      }}
      dropdownStyle={{
        borderBottom: '1px solid #dce5eb'
      }}
      searchable={false}
      clearable
      input={props.input}
      meta={props.meta}
      label="Title"
      items={items}
      defaultSelectedItem={items[0]}
      dropdownOptions={{
        fullHeight: true
      }}
    />
  )
}
