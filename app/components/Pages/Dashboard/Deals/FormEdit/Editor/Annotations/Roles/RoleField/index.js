import React, { useState, Fragment } from 'react'

import {
  normalizeRoleNames,
  getAttributeValue
} from 'deals/FormEdit/utils/get-roles-text'

import { isPrimaryAgent } from 'deals/utils/roles'

import DealRole from 'components/DealRole'

import { AddRole } from '../AddRole'

export function RoleField(props) {
  const [activeRole, setRole] = useState(undefined)

  const { annotation } = props
  const allowedRoles = normalizeRoleNames(props.deal, annotation.role)
  const roles = getRolesList(props.roles, allowedRoles, annotation)

  return (
    <Fragment>
      <div style={props.style}>
        {roles.map((role, index) => (
          <span
            key={index}
            style={{
              cursor: 'pointer',
              fontSize: `${props.appearance.fontSize}px`
            }}
            onClick={() => setRole(role)}
          >
            {role.value}
            {index === roles.length - 1 ? '' : ', '}
          </span>
        ))}

        <AddRole {...props} onClick={() => setRole(null)} />
      </div>

      {activeRole !== undefined && (
        <DealRole
          isOpen
          deal={props.deal}
          form={activeRole}
          allowedRoles={allowedRoles}
          onUpsertRole={props.onUpsertRole}
          onDeleteRole={props.onDeleteRole}
          isRoleRemovable={activeRole && !isPrimaryAgent(activeRole.role)}
          onClose={() => setRole(undefined)}
        />
      )}
    </Fragment>
  )
}

function getRolesList(roles, allowedRoles, annotation) {
  const filteredRoles = roles.filter(role => allowedRoles.includes(role.role))
  let list = []

  if (annotation.type === 'Roles') {
    list = filteredRoles.map(role => ({
      ...role,
      value: getAttributeValue(role, annotation, '')
    }))
  }

  // if type isn't Roles then it's singular and we should extract that
  // based on the number that is defined in annotation
  const role = filteredRoles[annotation.number]

  if (role) {
    list = [
      {
        ...role,
        value: getAttributeValue(role, annotation)
      }
    ]
  }

  return list.filter(item => item.value)
}
