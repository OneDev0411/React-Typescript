import React from 'react'

import Tooltip from 'components/tooltip'

import { percent } from './helpers'

function StatColumn(props) {
  if (props.isVisibile === false) {
    return null
  }

  if (props.num === 0 || props.all === 0) {
    return <span>0%</span>
  }

  return (
    <Tooltip caption={`${props.num} ${props.title}`}>
      <span>{percent(props.num, props.all)}%</span>
    </Tooltip>
  )
}

export default StatColumn
