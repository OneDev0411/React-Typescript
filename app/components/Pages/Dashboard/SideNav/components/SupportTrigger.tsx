import React from 'react'

import IntercomTrigger from '../../../../../views/components/IntercomTrigger'

import { SideNavItem } from '../styled'
import SideNavButtonItem from './SideNavButtonItem'

export default function SupportTrigger() {
  return (
    <IntercomTrigger
      render={({ activeIntercom, isIntercomActive }) => {
        const onClick = isIntercomActive ? () => false : activeIntercom

        return (
          <SideNavItem>
            <SideNavButtonItem onClick={onClick}>Support</SideNavButtonItem>
          </SideNavItem>
        )
      }}
    />
  )
}
