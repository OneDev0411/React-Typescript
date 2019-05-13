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

  const getRoleIndex = index => {
    let position = index

    for (let i = 0; i < props.rectIndex; i++) {
      position += props.values[i].split(',').length - 1
    }

    return position
  }

  const handleSelectRole = (index = null) => {
    if (index === null) {
      return setRole(null)
    }

    const roles = props.roles.filter(user => allowedRoles.includes(user.role))

    setRole(roles[getRoleIndex(index)])
  }

  // console.log(props)

  const values = props.value ? props.value.split(',') : []

  return (
    <Fragment>
      <div style={props.style}>
        {values.map((value, index) => (
          <span
            style={{ cursor: 'pointer' }}
            key={index}
            onClick={() => handleSelectRole(index)}
          >
            {value &&
              `${value.trim()}${index !== values.length - 1 ? ', ' : ''}`}
          </span>
        ))}

        {props.rectIndex === Object.keys(props.values).length - 1 && (
          <AddRole onClick={() => handleSelectRole(null)} />
        )}
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
