import React, { useState, Fragment } from 'react'

import { normalizeRoleNames } from '../../../../utils/get-roles-text'

import { AddRole } from '../AddRole'
import RoleCrmIntegration from '../../../../../components/Roles/CrmIntegration'
import { ContextInlineEdit } from '../../../ContextInlineEdit'

export function RoleField(props) {
  const [activeRole, setRole] = useState(undefined)

  const allowedRoles = normalizeRoleNames(
    props.deal,
    props.annotation.role.join(',')
  )

  // console.log(props.annotation)
  const handleSelectRole = (index = null) => {
    if (index === null) {
      return setRole(null)
    }

    const roles = props.roles.filter(user => allowedRoles.includes(user.role))

    setRole(roles[index])
  }

  return (
    <Fragment>
      <div style={props.style}>
        {props.value &&
          props.value.split(',').map((value, index) => (
            <span
              style={{ cursor: 'pointer' }}
              key={index}
              onClick={() => handleSelectRole(index)}
            >
              {value ? `${value}, ` : ''}
            </span>
          ))}

        <AddRole onClick={() => handleSelectRole(null)} />
      </div>

      {activeRole !== undefined && (
        <ContextInlineEdit
          bounds={props.rect}
          onDismiss={() => setRole(undefined)}
        >
          <RoleCrmIntegration
            isOpen
            deal={props.deal}
            role={activeRole}
            allowedRoles={allowedRoles}
            onUpsertRole={props.onUpsertRole}
            onHide={() => setRole(undefined)}
          />
        </ContextInlineEdit>
      )}
    </Fragment>
  )
}
