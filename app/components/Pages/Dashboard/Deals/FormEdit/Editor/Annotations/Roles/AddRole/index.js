import React from 'react'

import ToolTip from 'components/tooltip'

import IconButton from 'components/Button/IconButton'
import IconAdd from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

export function AddRole(props) {
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
