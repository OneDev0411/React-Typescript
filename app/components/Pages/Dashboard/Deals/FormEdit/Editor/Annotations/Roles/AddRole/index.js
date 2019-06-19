import React, { useState } from 'react'

import { isPrimaryAgent } from 'deals/utils/roles'
import ToolTip from 'components/tooltip'
import Roles from 'deals/components/Roles'

import IconAdd from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

import { Container, RolesList } from './styled'

export function AddRole(props) {
  const [showRolesList, setShowRoles] = useState(false)

  const isPrimaryRole = props.annotation.role.some(
    roleName =>
      roleName === 'PrimaryAgent' ||
      isPrimaryAgent(roleName, props.deal.deal_type)
  )

  const isSingularRole =
    props.annotation.type === 'Role' && props.roles.length > 0

  if (
    isPrimaryRole ||
    isSingularRole ||
    (Object.keys(props.values).length > 1 &&
      props.rectIndex < props.group.length - 1)
  ) {
    return false
  }

  const tooltip =
    props.tooltip || `Add new ${props.annotation.role.join(' or ')}`

  const handleClick = () => {
    if (!isSingularRole && props.isEmpty) {
      setShowRoles(!showRolesList)

      return
    }

    props.onClick()
  }

  const handleUpsertRole = role => {
    setShowRoles(false)
    props.onUpsertRole(role)
  }

  return (
    <Container>
      <ToolTip caption={tooltip} placement="top">
        <IconAdd
          onClick={handleClick}
          style={{
            height: props.style.height,
            fill: props.style.color
          }}
        />
      </ToolTip>

      {showRolesList && (
        <RolesList top={props.rect.height}>
          <Roles
            showEmail={false}
            showTitle={false}
            allowDeleteRole={false}
            deal={props.deal}
            filter={role => props.annotation.role.includes(role.role)}
            allowedRoles={props.annotation.role}
            onUpsertRole={handleUpsertRole}
          />
        </RolesList>
      )}
    </Container>
  )
}
