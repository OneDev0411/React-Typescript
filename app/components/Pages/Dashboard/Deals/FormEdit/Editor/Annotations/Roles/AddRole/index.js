import React from 'react'

import { isPrimaryAgent } from 'deals/utils/roles'
import ToolTip from 'components/tooltip'

import IconAdd from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

export function AddRole(props) {
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

  return (
    <span style={{ marginLeft: '0.25rem' }}>
      <ToolTip caption={tooltip} placement="top">
        <IconAdd
          onClick={props.onClick}
          style={{
            height: props.style.height,
            fill: props.style.color
          }}
        />
      </ToolTip>
    </span>
  )
}
