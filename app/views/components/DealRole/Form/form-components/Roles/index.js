import React, { useMemo } from 'react'

import { SelectInput } from 'components/Forms/SelectInput'

import { roleName, ROLE_NAMES } from 'deals/utils/roles'

export function Roles({ input, meta, isAllowedRole, isRequired }) {
  const role = input.value

  const options = useMemo(() => {
    let options = ROLE_NAMES.filter(value => isAllowedRole(value, role)).map(
      value => ({
        value,
        label: roleName(value)
      })
    )

    if (role && !options.length) {
      options = [
        {
          value: role,
          label: roleName(role)
        }
      ]
    }

    if (options.length > 1) {
      options = [
        {
          value: null,
          label: 'Select a role'
        },
        ...options
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
      hasBottomLine={false}
      showError={false}
      searchable={false}
      input={input}
      meta={meta}
      label="Role"
      onChange={item => input.onChange(item.value)}
      items={options}
      dropdownOptions={{
        fullWidth: true,
        pullTo: 'right',
        maxHeight: 350,
        fullHeight: options.length < 8
      }}
    />
  )
}
