import React from 'react'

import IconSearch from '../../../../../views/components/SvgIcons/Search/IconSearch'
import IconNotification from '../../../../../views/components/SvgIcons/Notifications/IconNotifications'

import { NavItem } from './Item'

export function MainNav() {
  return (
    <div>
      <NavItem indexed text="Search" to="/dashboard/mls" Icon={IconSearch} />
      <NavItem
        text="Following"
        to="/dashboard/mls/following"
        Icon={IconNotification}
      />
    </div>
  )
}
