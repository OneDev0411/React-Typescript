import React, { useRef } from 'react'

import ToolTip from 'components/tooltip'

import IconButton from 'components/Button/IconButton'
import IconAdd from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

export function AddRole(props) {
  const container = useRef(null)

  return (
    <span style={{ marginLeft: '0.25rem' }} ref={container}>
      <ToolTip caption="Add new role" placement="bottom">
        <IconButton
          isFit
          iconSize="medium"
          onClick={() =>
            props.onClick(container.current.getBoundingClientRect())
          }
        >
          <IconAdd />
        </IconButton>
      </ToolTip>
    </span>
  )
}
