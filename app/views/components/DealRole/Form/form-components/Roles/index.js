import React from 'react'

import { SelectInput } from 'components/Forms/SelectInput'

import getSortedOptions from '../../../helpers/normalize-roles-options'

export function Roles(props) {
  const options = getSortedOptions({
    role: props.input.value,
    isAllowedRole: props.isAllowedRole
  })

  return (
    <SelectInput
      style={{
        width: '45%',
        borderBottom: 'none'
      }}
      isRequired={props.isRequired}
      searchable={false}
      input={props.input}
      meta={props.meta}
      label="Role"
      onChange={item => props.input.onChange(item.value)}
      items={options}
      defaultSelectedItem={
        props.input.value
          ? options.find(item => item.value === props.input.value)
          : options[0]
      }
      dropdownOptions={{
        fullWidth: true,
        pullTo: 'right',
        maxHeight: 350,
        fullHeight: options.length < 8
      }}
    />
  )
}
