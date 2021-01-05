import React, { useState } from 'react'
import ClickOutside from 'react-click-outside'
import { mdiPlusCircleOutline } from '@mdi/js'

import { Tooltip } from '@material-ui/core'

import { isPrimaryAgent } from 'deals/utils/roles'
import { dynamicRoles } from 'deals/FormEdit/utils/normalize-role-names'
import Roles from 'deals/components/Roles'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { Container, RolesList } from './styled'

export function AddRole(props) {
  const [showRolesList, setShowRoles] = useState(false)

  const isDynamicRole = props.annotation.role.some(roleName =>
    dynamicRoles.includes(roleName)
  )

  const isPrimaryRole = props.annotation.role.some(
    roleName =>
      roleName === 'PrimaryAgent' ||
      isPrimaryAgent(roleName, props.deal.deal_type)
  )

  const isSingularRole =
    props.annotation.type === 'Role' && props.roles.length > 0

  if (
    isDynamicRole ||
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
      <Tooltip title={tooltip || ''} placement="top">
        <SvgIcon
          path={mdiPlusCircleOutline}
          onClick={handleClick}
          size={props.style.height}
          color={props.style.color}
        />
      </Tooltip>

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
