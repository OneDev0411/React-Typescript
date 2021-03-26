import React from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import { GlobalActionsButton } from 'components/GlobalActionsButton'

import { selectUserUnsafe } from 'selectors/user'

import { ACL } from 'constants/acl'
import { selectNotificationNewCount } from 'reducers/notifications'
import { selectUnreadEmailThreadsCount } from 'reducers/inbox'
import { InboxAction } from 'reducers/inbox/types'

import { fetchUnreadEmailThreadsCount } from 'actions/inbox'

import { useDealsNotificationsNumber } from 'hooks/use-deals-notifications-number'
import { useChatRoomsNotificationsNumber } from 'hooks/use-chat-rooms-notifications-number'

import Acl from 'views/components/Acl'

import { ScrollableArea } from 'views/components/ScrollableArea'

import { IAppState } from 'reducers'

import useEmailThreadEvents from '../Inbox/helpers/use-email-thread-events'

import Logo from './components/Logo'
import { UserMenu } from './components/UserMenu'
import SideNavLinkItem from './components/SideNavLinkItem'
import MessagesDrawerTrigger from './components/MessagesDrawerTrigger'
import SupportTrigger from './components/SupportTrigger'

import { scrollableAreaShadowColor } from './variables'

import {
  Sidenav,
  SidenavBlankLink,
  SideNavItem,
  SidenavListGroup,
  AppNavbarBadge
} from './styled'

const openHouseAccess = [ACL.CRM, ACL.MARKETING]
const dealsAccess = { oneOf: [ACL.DEALS, ACL.BACK_OFFICE] }
const insightAccess = { oneOf: [ACL.MARKETING, ACL.CRM] }

export function Menu() {
  const user = useSelector(selectUserUnsafe)
  const appNotifications = useSelector((state: IAppState) =>
    selectNotificationNewCount(state.globalNotifications)
  )
  const inboxNotificationNumber = useSelector((state: IAppState) =>
    selectUnreadEmailThreadsCount(state.inbox)
  )
  const dealsNotificationsNumber = useDealsNotificationsNumber()
  const chatRoomsNotificationsNumber = useChatRoomsNotificationsNumber()

  const dispatch = useDispatch<ThunkDispatch<any, any, InboxAction>>()

  function handleEmailThreadEvent(): void {
    dispatch(fetchUnreadEmailThreadsCount())
  }

  useEmailThreadEvents(handleEmailThreadEvent, handleEmailThreadEvent)

  return (
    <Sidenav>
      <Logo />
      <GlobalActionsButton />
      <ScrollableArea
        shadowColor={scrollableAreaShadowColor}
        style={{ flex: '1 1' }}
        hasThinnerScrollbar
      >
        <SidenavListGroup data-test="side-nav-list">
          {user?.email === 'shayan@rechat.com' && (
            <SideNavLinkItem to="/dashboard/overview">
              Dashboard
            </SideNavLinkItem>
          )}

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

          <SideNavLinkItem to="/dashboard/mls">Properties</SideNavLinkItem>

          <Acl.AgentNetwork>
            <SideNavLinkItem to="/dashboard/agent-network">
              Agent Network
            </SideNavLinkItem>
          </Acl.AgentNetwork>

          <Acl access={insightAccess}>
            <SideNavLinkItem to="/dashboard/insights">Insight</SideNavLinkItem>
          </Acl>

          <Acl.Crm>
            <SideNavLinkItem to="/dashboard/tours">Tours</SideNavLinkItem>
          </Acl.Crm>

          <Acl access={openHouseAccess}>
            <SideNavLinkItem to="/dashboard/open-house">
              Open House
            </SideNavLinkItem>
          </Acl>

          <Acl access={dealsAccess}>
            <SideNavLinkItem to="/dashboard/deals">
              <AppNavbarBadge
                badgeContent={dealsNotificationsNumber}
                color="primary"
              >
                Deals
              </AppNavbarBadge>
            </SideNavLinkItem>
          </Acl>

          <Acl access={ACL.WEBSITES}>
            <SideNavLinkItem to="/dashboard/websites">Websites</SideNavLinkItem>
          </Acl>

          <Acl access={[ACL.STORE]}>
            <SideNavLinkItem to="/dashboard/website">Store</SideNavLinkItem>
          </Acl>

          <Acl access={ACL.MARKETING}>
            <SideNavLinkItem to="/dashboard/showings">Showings</SideNavLinkItem>
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
        </SidenavListGroup>
        <SidenavListGroup>
          <SideNavItem>
            <SidenavBlankLink
              target="_blank"
              rel="noopener noreferrer"
              href="https://help.rechat.com"
            >
              Help Center
            </SidenavBlankLink>
          </SideNavItem>

          <SupportTrigger />
        </SidenavListGroup>
      </ScrollableArea>

      <UserMenu user={user} />
    </Sidenav>
  )
}
