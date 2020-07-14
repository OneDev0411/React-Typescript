import Flex from 'styled-flex-component'
import { Field } from 'react-final-form'

import * as React from 'react'
import { mdiTrashCanOutline } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import IconButton from 'components/Button/IconButton'
import { TextInput } from 'components/Forms/TextInput'

import { PermissionCell } from './PermissionCell'
import { permissions } from '../permissions'

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
