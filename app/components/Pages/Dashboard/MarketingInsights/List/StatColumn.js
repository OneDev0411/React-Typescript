import React from 'react'

import Tooltip from 'components/tooltip'

function StatColumn(props) {
  if (props.isVisibile === false) {
    return null
  }

  return (
    <Tooltip caption={props.tooltipTitle}>
      <span>{props.content}</span>
    </Tooltip>
  )
}

export default StatColumn
