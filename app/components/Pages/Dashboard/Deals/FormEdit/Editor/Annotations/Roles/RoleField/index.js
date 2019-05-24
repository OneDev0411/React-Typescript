import React, { useState, Fragment } from 'react'

import { normalizeRoleNames } from 'deals/FormEdit/utils/get-roles-text'
import { getRolesList } from 'deals/FormEdit/utils/get-roles-list'
import { isPrimaryAgent } from 'deals/utils/roles'

import DealRole from 'components/DealRole'

import { AddRole } from '../AddRole'
import { RoleItem } from './styled'

export function RoleField(props) {
  const [activeRole, setRole] = useState(undefined)

  const allowedRoles = normalizeRoleNames(props.deal, props.annotation.role)

  const roles = getRolesList({
    allowedRoles,
    roles: props.roles,
    values: props.values,
    annotation: props.annotation
  })

  const annotationRoles = roles[props.rectIndex]

  return (
    <Fragment>
      <div style={props.style}>
        {Array.isArray(annotationRoles) &&
          annotationRoles.map((role, index) => (
            <Fragment key={index}>
              <RoleItem
                isActive={activeRole && role.id === activeRole.id}
                style={{
                  fontSize: `${props.appearance.fontSize}px`
                }}
                onClick={() => setRole(role)}
              >
                {role.value}
              </RoleItem>
              {index === annotationRoles.length - 1 ? '' : ', '}
            </Fragment>
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
