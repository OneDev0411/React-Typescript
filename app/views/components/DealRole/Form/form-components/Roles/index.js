import React, { useMemo } from 'react'

import { SelectInput } from 'components/Forms/SelectInput'

import { roleName, ROLE_NAMES } from 'deals/utils/roles'

export function Roles({ input, meta, isAllowedRole, isRequired }) {
  const role = input.value

  const options = useMemo(() => {
    let options = [null, ...ROLE_NAMES]
      .filter(value => value === null || isAllowedRole(value, role))
      .map(value => ({
        value,
        label: value ? roleName(value) : 'Select Role'
      }))

    if (!options.length && role) {
      options = [
        {
          value: role,
          label: roleName(role)
        }
      ]
    }

    return options
  }, [isAllowedRole, role])

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
