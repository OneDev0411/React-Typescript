import React from 'react'

import { Tooltip } from '@material-ui/core'

interface SideNavTooltipProps {
  text?: string
  children: any
}

function SideNavTooltip(props: SideNavTooltipProps) {
  if (!props.text) {
    return props.children
  }

  return (
    <Tooltip title={props.text} placement="right">
      {props.children}
    </Tooltip>
  )
}

export default SideNavTooltip
