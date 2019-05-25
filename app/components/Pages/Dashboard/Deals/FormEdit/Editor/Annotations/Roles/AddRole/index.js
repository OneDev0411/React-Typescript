import React from 'react'

import { isPrimaryAgent } from 'deals/utils/roles'

import ToolTip from 'components/tooltip'

import IconButton from 'components/Button/IconButton'
import IconAdd from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

export function AddRole(props) {
  const isPrimaryRole = props.annotation.role.some(roleName =>
    isPrimaryAgent(roleName, props.deal.deal_type)
  )

  if (
    isPrimaryRole ||
    (Object.keys(props.values).length > 1 &&
      props.rectIndex < props.group.length - 1) ||
    (props.annotation.type === 'Role' && props.roles.length > 0)
  ) {
    return false
  }

  const tooltip =
    props.tooltip || `Add new ${props.annotation.role.join(' or ')}`

  return (
    <span style={{ marginLeft: '0.25rem' }}>
      <ToolTip caption={tooltip} placement="top">
        <IconButton isFit iconSize="medium" onClick={props.onClick}>
          <IconAdd />
        </IconButton>
      </ToolTip>
    </span>
  )
}
