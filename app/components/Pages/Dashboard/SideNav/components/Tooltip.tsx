import React from 'react'
import { Tooltip, TooltipProps } from '@material-ui/core'

export function SideNavTooltip({ children, ...props }: TooltipProps) {
  return (
    <Tooltip placement="right" {...props}>
      {children}
    </Tooltip>
  )
}
