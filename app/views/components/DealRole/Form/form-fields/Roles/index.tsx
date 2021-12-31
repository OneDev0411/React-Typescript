import { useMemo } from 'react'

import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import { FieldInputProps, FieldMetaState } from 'react-final-form'

import { useDealsRolesContext } from '@app/contexts/deals-roles-definitions/use-deals-roles-context'
import { useBrandPropertyTypeRoles } from '@app/hooks/use-brand-property-type-roles'

interface RoleOption {
  value: string
  label: string
}

interface Props {
  meta: FieldMetaState<any>
  input: FieldInputProps<any, HTMLElement>
  deal: IDeal
  isAllowedRole: (value: string, role: string) => boolean
  isRequired: boolean
}

export function Roles({ meta, input, deal, isAllowedRole }: Props) {
  const role = input.value
  const { dealRolesByName } = useDealsRolesContext()
  const { roles } = useBrandPropertyTypeRoles(deal?.property_type?.label)

  const options = useMemo(() => {
    let options: RoleOption[] = roles
      .filter(item => item && isAllowedRole(item.role, role))
      .map(item => ({
        value: item.role,
        label: item.title
      }))

    if (role && !options.length) {
      options = [
        {
          value: role,
          label: dealRolesByName[role]?.title
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
  }, [isAllowedRole, role, dealRolesByName, roles])

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
