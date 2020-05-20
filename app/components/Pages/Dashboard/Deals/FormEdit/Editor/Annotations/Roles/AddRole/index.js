import React, { useState } from 'react'
import ClickOutside from 'react-click-outside'

import { isPrimaryAgent } from 'deals/utils/roles'
import { specialRoles } from 'deals/FormEdit/utils/normalize-role-names'
import ToolTip from 'components/tooltip'
import Roles from 'deals/components/Roles'

import IconAdd from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

import { Container, RolesList } from './styled'

export function AddRole(props) {
  const [showRolesList, setShowRoles] = useState(false)

  const isSpecialRole = props.annotation.role.some(roleName =>
    specialRoles.includes(roleName)
  )

  const isPrimaryRole = props.annotation.role.some(
    roleName =>
      roleName === 'PrimaryAgent' ||
      isPrimaryAgent(roleName, props.deal.deal_type)
  )

  const isSingularRole =
    props.annotation.type === 'Role' && props.roles.length > 0

  if (
    isSpecialRole ||
    isPrimaryRole ||
    isSingularRole ||
    (Object.keys(props.values).length > 1 &&
      props.rectIndex < props.group.length - 1)
  ) {
    return null
  }

  const tooltip =
    props.tooltip || `Add new ${props.annotation.role.join(' or ')}`

  const handleClick = () => {
    if (!isSingularRole) {
      setShowRoles(!showRolesList)

      return
    }

    props.onClick()
  }

  const handleClickOutside = () => {
    setShowRoles(
      document.getElementsByClassName('deal-role-form-modal').length > 0 ||
        document.getElementsByClassName('MuiDrawer-root').length > 0
    )
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
        <ClickOutside onClickOutside={handleClickOutside}>
          <RolesList top={props.rect.height}>
            <Roles
              showEmail={false}
              showTitle={false}
              allowDeleteRole={false}
              showBrokerageFields={props.showBrokerageFields}
              deal={props.deal}
              filter={role => props.annotation.role.includes(role.role)}
              allowedRoles={props.annotation.role}
              onUpsertRole={handleUpsertRole}
              onCreateRole={handleUpsertRole}
            />
          </RolesList>
        </ClickOutside>
      )}
    </Container>
  )
}
