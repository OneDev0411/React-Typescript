import React, { ReactElement } from 'react'
import { Tooltip } from '@material-ui/core'

interface RenderWithTooltipProps {
  children: ReactElement<any>
  title?: string
}

export default function RenderWithTooltip({
  children,
  title
}: RenderWithTooltipProps) {
  if (title) {
    return <Tooltip title={title}>{children}</Tooltip>
  }

  return children
}
