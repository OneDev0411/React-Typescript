import React from 'react'
import _ from 'underscore'

import { SelectInput } from 'components/Forms/SelectInput'

import {
  roleName,
  ROLE_NAMES
} from '../../../../../../components/Pages/Dashboard/Deals/utils/roles'

export function Roles(props) {
  const sortedOptions = _.chain([null, ...ROLE_NAMES])
    .map(value => ({
      value,
      label: value ? roleName(value) : 'Select Role',
      disabled: true // !props.isAllowed(value, props.formRole)
    }))
    .sortBy(item => item.disabled)
    .value()

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
      items={sortedOptions}
      defaultSelectedItem={sortedOptions[0]}
      dropdownOptions={{
        pullTo: 'right',
        maxHeight: 350
      }}
    />
  )
}
