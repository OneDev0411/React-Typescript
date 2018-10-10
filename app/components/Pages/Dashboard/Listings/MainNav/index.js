import React from 'react'

import IconSearch16 from '../../../../../views/components/SvgIcons/Search/IconSearch'
import IconNotification from '../../../../../views/components/SvgIcons/Notifications/IconNotifications'
import IconTour from '../../../../../views/components/SvgIcons/Tour/IconTour'

import { NavItem } from './Item'
import styled from 'styled-components'

const IconSearch = styled(IconSearch16)`
  width: 0.75rem;
  height: 0.75rem;
`

const TourIcon = styled(IconTour)`
  width: 1rem;
  height: 1rem;
`

export function MainNav() {
  return (
    <div style={{ marginBottom: '2.5em' }}>
      <NavItem
        indexed
        text="Search"
        to="/dashboard/mls"
        Icon={IconSearch}
        caption="Search NTREIS"
      />
      <NavItem
        text="Following"
        to="/dashboard/mls/following"
        Icon={IconNotification}
      />
      <NavItem
        text="Tours"
        marginRight="0.5em"
        to="/dashboard/mls/tours"
        Icon={TourIcon}
      />
    </div>
  )
}
