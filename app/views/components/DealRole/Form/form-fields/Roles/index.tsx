import React, { useMemo } from 'react'

import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'

import { FieldInputProps, FieldMetaState } from 'react-final-form'

import { roleName, ROLE_NAMES } from 'deals/utils/roles'

interface RoleOption {
  value: string
  label: string
}

interface Props {
  meta: FieldMetaState<any>
  input: FieldInputProps<any, HTMLElement>
  isAllowedRole: (value: string, role: string) => boolean
  isRequired: boolean
}

export function Roles({ meta, input, isAllowedRole }: Props) {
  const role = input.value

  const options = useMemo(() => {
    let options: RoleOption[] = ROLE_NAMES.filter(value =>
      isAllowedRole(value, role)
    ).map(value => ({
      value,
      label: roleName(value)
    }))

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
          value: '',
          label: 'Select a role'
        },
        ...options
      ]
    }

    return options
  }, [isAllowedRole, role])

  return (
    <FormControl variant="outlined" size="small" fullWidth>
      <InputLabel id="create-role--role-type">Role</InputLabel>
      <Select
        labelId="create-role--role-type"
        label="Role *"
        value={input.value}
        error={meta.error}
        onChange={e => input.onChange(e.target.value)}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
