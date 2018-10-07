import React from 'react'

import IconSearch from '../../../../../views/components/SvgIcons/Search/IconSearch'
import IconNotification from '../../../../../views/components/SvgIcons/Notifications/IconNotifications'

import { NavItem } from './Item'

export function MainNav() {
  return (
    <div style={{ marginBottom: '2.5em' }}>
      <NavItem
        marginRight="0.5em"
        indexed
        text="Search"
        to="/dashboard/mls"
        Icon={IconSearch}
        caption="Search NTREIS"
      />
      <NavItem
        marginRight="0.875em"
        text="Following"
        to="/dashboard/mls/following"
        Icon={IconNotification}
      />
    </div>
  )
}
