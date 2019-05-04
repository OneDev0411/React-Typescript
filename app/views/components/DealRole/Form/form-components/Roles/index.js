import React, { useMemo } from 'react'
import _ from 'underscore'

import { SelectInput } from 'components/Forms/SelectInput'

import {
  roleName,
  ROLE_NAMES
} from '../../../../../../components/Pages/Dashboard/Deals/utils/roles'

export function Roles({ input, meta, isAllowedRole, isRequired }) {
  const role = input.value

  const options = useMemo(() => {
    let options = _.chain([null, ...ROLE_NAMES])
      .filter(value => isAllowedRole(value, role))
      .map(value => ({
        value,
        label: value ? roleName(value) : 'Select Role'
      }))
      .value()

    if (options.length === 0 && role) {
      options = [
        {
          value: role,
          label: roleName(role)
        }
      ]
    }

    return options
    // eslint-disable-next-line
  }, [ role ])

  return (
    <SelectInput
      style={{
        width: '45%',
        borderBottom: 'none'
      }}
      isRequired={isRequired}
      showError={false}
      searchable={false}
      input={input}
      meta={meta}
      label="Role"
      onChange={item => input.onChange(item.value)}
      items={options}
      defaultSelectedItem={
        input.value
          ? options.find(item => item.value === input.value)
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
