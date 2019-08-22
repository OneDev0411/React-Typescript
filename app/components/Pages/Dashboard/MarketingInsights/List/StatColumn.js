import React from 'react'

import Tooltip from 'components/tooltip'

function StatColumn(props) {
  return (
    <Tooltip caption={props.tooltipTitle}>
      <span>{props.content}</span>
    </Tooltip>
  )
}

export default StatColumn
