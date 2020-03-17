import React, { createRef } from 'react'
import { Box } from '@material-ui/core'

import IntercomTrigger from '../../../../../views/components/IntercomTrigger'

import { SideNavItem } from '../styled'
import { SideNavTooltip } from './Tooltip'
import SideNavButtonItem from './SideNavButtonItem'

export default function SupportTrigger() {
  const ref = createRef<HTMLButtonElement>()

  return (
    <IntercomTrigger
      render={({ activeIntercom, isIntercomActive }) => {
        const onClick = isIntercomActive ? () => false : activeIntercom

        return (
          <SideNavItem>
            <SideNavTooltip title="Support">
              <Box display="inline-flex" component="span">
                <SideNavButtonItem ref={ref} onClick={onClick}>
                  Support
                </SideNavButtonItem>
              </Box>
            </SideNavTooltip>
          </SideNavItem>
        )
      }}
    />
  )
}
