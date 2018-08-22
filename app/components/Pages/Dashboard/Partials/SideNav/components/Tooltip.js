import React from 'react'

import ToolTip from '../../../../../../views/components/tooltip'

export const SideNavTooltip = ({ caption, children }) => (
  <ToolTip caption={caption} placement="right">
    {children}
  </ToolTip>
)
