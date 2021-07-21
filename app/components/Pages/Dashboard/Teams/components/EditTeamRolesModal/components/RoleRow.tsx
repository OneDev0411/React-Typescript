import * as React from 'react'

import { mdiTrashCanOutline } from '@mdi/js'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import IconButton from 'components/Button/IconButton'
import { TextInput } from 'components/Forms/TextInput'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { permissions } from '../permissions'

import { PermissionCell } from './PermissionCell'

interface Props {
  fieldName: string
  onRemove: () => void
}

export function RoleRow({ fieldName, onRemove }: Props) {
  const roleField = `${fieldName}.role` // role name
  const aclField = `${fieldName}.acl`

  return (
    <tr>
      <td>
        <Flex alignCenter>
          <Field
            validate={value => !value && 'Role name is required'}
            autoFocus
            name={`${roleField}`}
            placeholder="Role"
            hasLabel={false}
            required
            component={TextInput as any}
          />
          <IconButton type="button" inverse onClick={onRemove}>
            <SvgIcon path={mdiTrashCanOutline} />
          </IconButton>
        </Flex>
      </td>
      {permissions.map(permission => (
        <PermissionCell
          key={`${aclField}-${permission.label}`}
          permission={permission.value}
          fieldName={`${aclField}`}
        />
      ))}
    </tr>
  )
}
