import React from 'react'

import ToolTip from 'components/tooltip'

interface SideNavTooltipProps {
  text?: string | string[]
  children: any
}

function SideNavTooltip(props: SideNavTooltipProps) {
  if (!props.text) {
    return props.children
  }

  let tooltipText = props.text
  let multiline = false

  if (Array.isArray(props.text)) {
    tooltipText = props.text.join('<br />')
    multiline = true
  }

  return (
    <ToolTip multiline={multiline} caption={tooltipText} placement="right">
      {props.children}
    </ToolTip>
  )
}

export default SideNavTooltip
