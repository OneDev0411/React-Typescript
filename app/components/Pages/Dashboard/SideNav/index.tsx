import React from 'react'
import { useDispatch } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import { ACL } from '../../../../constants/acl'
import { selectNotificationNewCount } from '../../../../reducers/notifications'
import { selectUnreadEmailThreadsCount } from '../../../../reducers/inbox'
import { InboxAction } from '../../../../reducers/inbox/types'

import { fetchUnreadEmailThreadsCount } from '../../../../store_actions/inbox'

import { useDealsNotificationsNumber } from '../../../../hooks/use-deals-notifications-number'
import { useChatRoomsNotificationsNumber } from '../../../../hooks/use-chat-rooms-notifications-number'
import useTypedSelector from '../../../../hooks/use-typeed-selector'

import useEmailThreadEvents from '../Inbox/helpers/use-email-thread-events'

import Acl from '../../../../views/components/Acl'
import { ScrollableArea } from '../../../../views/components/ScrollableArea'

import Brand from '../../../../controllers/Brand'

import Logo from './components/Logo'
import { UserMenu } from './components/UserMenu'
import SideNavLinkItem from './components/SideNavLinkItem'
import MessagesDrawerTrigger from './components/MessagesDrawerTrigger'
import SupportTrigger from './components/SupportTrigger'

import {
  Sidenav,
  SideNavItem,
  SidenavListGroup,
  AppNavbarBadge
} from './styled'
import { scrollableAreaShadowColor } from './variables'

const hasWebsitePermission = user =>
  user &&
  user.agent &&
  user.user_type === 'Agent' &&
  user.agent.office_mlsid === 'CSTPP01'

export default function AppSideNav() {
  const user = useTypedSelector<IUser>(state => state.user)
  const appNotifications = useTypedSelector(state =>
    selectNotificationNewCount(state.globalNotifications)
  )
  const inboxNotificationNumber = useTypedSelector(state =>
    selectUnreadEmailThreadsCount(state.inbox)
  )
  const dealsNotificationsNumber = useDealsNotificationsNumber()
  const chatRoomsNotificationsNumber = useChatRoomsNotificationsNumber()
  const logoSrc = Brand.asset('office_logo', '/static/images/logo.svg')

  const dispatch = useDispatch<ThunkDispatch<any, any, InboxAction>>()

  function handleEmailThreadEvent(): void {
    dispatch(fetchUnreadEmailThreadsCount())
  }

  useEmailThreadEvents(handleEmailThreadEvent, handleEmailThreadEvent)

  return (
    <Sidenav>
      <Logo src={logoSrc} />
      <ScrollableArea
        shadowColor={scrollableAreaShadowColor}
        style={{ flex: '1 1' }}
        hasThinnerScrollbar
      >
        <SidenavListGroup data-test="side-nav-list">
          <Acl.Crm>
            <SideNavLinkItem to="/dashboard/inbox">
              <AppNavbarBadge
                badgeContent={inboxNotificationNumber}
                color="primary"
              >
                Inbox
              </AppNavbarBadge>
            </SideNavLinkItem>
          </Acl.Crm>

          <Acl.Crm>
            <SideNavLinkItem to="/dashboard/calendar">Calendar</SideNavLinkItem>
          </Acl.Crm>

          <Acl.Crm>
            <SideNavLinkItem to="/dashboard/contacts">Contacts</SideNavLinkItem>
          </Acl.Crm>
        </SidenavListGroup>

        <SidenavListGroup>
          <Acl.Marketing>
            <SideNavLinkItem to="/dashboard/marketing">
              Marketing
            </SideNavLinkItem>
          </Acl.Marketing>

          <Acl.Marketing>
            <SideNavLinkItem to="/dashboard/insights">
              Email Insight
            </SideNavLinkItem>
          </Acl.Marketing>

          <Acl access={[ACL.DEALS, ACL.CRM, ACL.MARKETING]}>
            <SideNavLinkItem to="/dashboard/open-house">
              Open House
            </SideNavLinkItem>
          </Acl>

          <Acl.Crm>
            <SideNavLinkItem to="/dashboard/tours">Tours</SideNavLinkItem>
          </Acl.Crm>

          <SideNavLinkItem to="/dashboard/mls">Properties</SideNavLinkItem>

          <Acl access={hasWebsitePermission}>
            <SideNavLinkItem to="/dashboard/website">Store</SideNavLinkItem>
          </Acl>

          <Acl access={{ oneOf: [ACL.DEALS, ACL.BACK_OFFICE] }}>
            <SideNavLinkItem to="/dashboard/deals">
              <AppNavbarBadge
                badgeContent={dealsNotificationsNumber}
                color="primary"
              >
                Deals
              </AppNavbarBadge>
            </SideNavLinkItem>
          </Acl>
        </SidenavListGroup>

        <SidenavListGroup>
          {user && (
            <SideNavItem>
              <AppNavbarBadge
                badgeContent={chatRoomsNotificationsNumber}
                color="primary"
              >
                <MessagesDrawerTrigger />
              </AppNavbarBadge>
            </SideNavItem>
          )}

          {user && (
            <SideNavLinkItem to="/dashboard/notifications">
              <AppNavbarBadge badgeContent={appNotifications} color="primary">
                Notifications
              </AppNavbarBadge>
            </SideNavLinkItem>
          )}

          <SupportTrigger />
        </SidenavListGroup>
      </ScrollableArea>

      <UserMenu user={user} />
    </Sidenav>
  )
}
