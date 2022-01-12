import React from 'react'

import IntercomTrigger from '../../../../../views/components/IntercomTrigger'
import { SideNavItem } from '../styled'

import SideNavButtonItem from './SideNavButtonItem'

export default function SupportTrigger({ children }) {
  return (
    <IntercomTrigger
      render={({ activateIntercom, isIntercomActive }) => {
        const onClick = isIntercomActive ? () => false : activateIntercom

        return (
          <SideNavItem>
            <SideNavButtonItem onClick={onClick}>{children}</SideNavButtonItem>
          </SideNavItem>
        )
      }}
    />
  )
}
