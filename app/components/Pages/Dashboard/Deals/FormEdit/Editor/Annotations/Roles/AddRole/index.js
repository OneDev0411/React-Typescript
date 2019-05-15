import React from 'react'

import { isPrimaryAgent } from 'deals/utils/roles'

import ToolTip from 'components/tooltip'

import IconButton from 'components/Button/IconButton'
import IconAdd from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

export function AddRole(props) {
  const isPrimaryRole = props.annotation.role.some(roleName =>
    isPrimaryAgent(roleName, props.deal.deal_type)
  )

  if (isPrimaryRole || props.rectIndex < Object.keys(props.values).length - 1) {
    return false
  }

  return (
    <span style={{ marginLeft: '0.25rem' }}>
      <ToolTip caption="Add new role" placement="bottom">
        <IconButton isFit iconSize="medium" onClick={props.onClick}>
          <IconAdd />
        </IconButton>
      </ToolTip>
    </span>
  )
}
