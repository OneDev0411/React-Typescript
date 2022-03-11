import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import { fetchUnreadEmailThreadsCount } from 'actions/inbox'
import { GlobalActionsButton } from 'components/GlobalActionsButton'
import { InlineBadge } from 'components/InlineBadge'
import { ACL } from 'constants/acl'
import { useChatRoomsNotificationsNumber } from 'hooks/use-chat-rooms-notifications-number'
import { useDealsNotificationsNumber } from 'hooks/use-deals-notifications-number'
import { IAppState } from 'reducers'
import { selectUnreadEmailThreadsCount } from 'reducers/inbox'
import { InboxAction } from 'reducers/inbox/types'
import { selectNotificationNewCount } from 'reducers/notifications'
import { selectShowingsTotalNotificationCount } from 'selectors/showings'
import { selectUserUnsafe } from 'selectors/user'
import { getBrandHelpCenterURL } from 'utils/brand'
import Acl from 'views/components/Acl'
import { ScrollableArea } from 'views/components/ScrollableArea'

import useEmailThreadEvents from '../Inbox/helpers/use-email-thread-events'

import Logo from './components/Logo'
import MessagesDrawerTrigger from './components/MessagesDrawerTrigger'
import PoweredBy from './components/PoweredBy'
import SideNavLinkItem from './components/SideNavLinkItem'
import SupportTrigger from './components/SupportTrigger'
import { UserMenu } from './components/UserMenu'
import {
  Sidenav,
  SidenavBlankLink,
  SideNavItem,
  SidenavListGroup
} from './styled'
import { scrollableAreaShadowColor } from './variables'

const openHouseAccess = [ACL.CRM, ACL.MARKETING]
const dealsAccess = { oneOf: [ACL.DEALS, ACL.BACK_OFFICE] }
const insightAccess = { oneOf: [ACL.MARKETING, ACL.CRM] }
const dashboardAccess = { oneOf: [ACL.CRM, ACL.DEALS] }
const listingsAccess = { oneOf: [ACL.DEALS, ACL.BACK_OFFICE, ACL.MARKETING] }

export function Menu() {
  const user = useSelector(selectUserUnsafe)

  const brand = useSelector<IAppState, IBrand>(
    (state: IAppState) => state.brand
  )
  const appNotifications = useSelector((state: IAppState) =>
    selectNotificationNewCount(state.globalNotifications)
  )
  const inboxNotificationNumber = useSelector((state: IAppState) =>
    selectUnreadEmailThreadsCount(state.inbox)
  )
  const dealsNotificationsNumber = useDealsNotificationsNumber()
  const chatRoomsNotificationsNumber = useChatRoomsNotificationsNumber()

  const showingsTotalNotificationCount = useSelector(
    selectShowingsTotalNotificationCount
  )

  const dispatch = useDispatch<ThunkDispatch<any, any, InboxAction>>()

  function handleEmailThreadEvent(): void {
    dispatch(fetchUnreadEmailThreadsCount())
  }

  // This is initially implemented for DE because they're using a
  // white-labeled version of help.rechat.com
  const brandHelpCenterURL = getBrandHelpCenterURL(brand)

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
          <Acl access={dashboardAccess}>
            <SideNavLinkItem to="/dashboard/overview" tourId="nav-dashboard">
              Today
            </SideNavLinkItem>
          </Acl>
          <Acl.Crm>
            <SideNavLinkItem to="/dashboard/inbox" tourId="nav-inbox">
              <InlineBadge
                badgeContent={inboxNotificationNumber}
                color="primary"
              >
                Inbox
              </InlineBadge>
            </SideNavLinkItem>
          </Acl.Crm>

          <Acl.Crm>
            <SideNavLinkItem to="/dashboard/calendar" tourId="nav-calendar">
              Calendar
            </SideNavLinkItem>
          </Acl.Crm>

          <Acl.Crm>
            <SideNavLinkItem to="/dashboard/contacts" tourId="nav-contacts">
              Contacts
            </SideNavLinkItem>
          </Acl.Crm>
        </SidenavListGroup>

        <SidenavListGroup>
          <Acl.Marketing>
            <SideNavLinkItem to="/dashboard/marketing" tourId="nav-marketing">
              Marketing
            </SideNavLinkItem>
          </Acl.Marketing>

          <Acl.Crm>
            <SideNavLinkItem to="/dashboard/flows" tourId="nav-flows">
              Flows
            </SideNavLinkItem>
          </Acl.Crm>

          <SideNavLinkItem to="/dashboard/mls" tourId="nav-properties">
            Properties
          </SideNavLinkItem>

          <Acl.AgentNetwork>
            <SideNavLinkItem
              to="/dashboard/agent-network"
              tourId="nav-agent-network"
            >
              Agent Network
            </SideNavLinkItem>
          </Acl.AgentNetwork>

          <Acl access={insightAccess}>
            <SideNavLinkItem to="/dashboard/insights" tourId="nav-insight">
              Insights
            </SideNavLinkItem>
          </Acl>

          <Acl.Crm>
            <SideNavLinkItem to="/dashboard/tours" tourId="nav-tours">
              Tours
            </SideNavLinkItem>
          </Acl.Crm>

          <Acl access={openHouseAccess}>
            <SideNavLinkItem to="/dashboard/open-house" tourId="nav-open-house">
              Open House
            </SideNavLinkItem>
          </Acl>

          <Acl access={dealsAccess}>
            <SideNavLinkItem to="/dashboard/deals" tourId="nav-deals">
              <InlineBadge
                badgeContent={dealsNotificationsNumber}
                color="primary"
              >
                Deals
              </InlineBadge>
            </SideNavLinkItem>
          </Acl>

          <Acl access={listingsAccess}>
            <SideNavLinkItem to="/dashboard/listings" tourId="nav-listings">
              Listings
            </SideNavLinkItem>
          </Acl>

          <Acl access={ACL.WEBSITES}>
            <SideNavLinkItem to="/dashboard/websites" tourId="nav-websites">
              Websites
            </SideNavLinkItem>
          </Acl>

          <Acl access={ACL.SHOWINGS}>
            <SideNavLinkItem to="/dashboard/showings">
              <InlineBadge
                badgeContent={showingsTotalNotificationCount}
                color="primary"
              >
                Showings
              </InlineBadge>
            </SideNavLinkItem>
          </Acl>
        </SidenavListGroup>

        <SidenavListGroup>
          {user && (
            <SideNavItem>
              <InlineBadge
                badgeContent={chatRoomsNotificationsNumber}
                color="primary"
              >
                <MessagesDrawerTrigger />
              </InlineBadge>
            </SideNavItem>
          )}

          {user && (
            <SideNavLinkItem to="/dashboard/notifications">
              <InlineBadge badgeContent={appNotifications} color="primary">
                Notifications
              </InlineBadge>
            </SideNavLinkItem>
          )}
        </SidenavListGroup>
        <SidenavListGroup>
          <SideNavItem>
            <SidenavBlankLink
              target="_blank"
              rel="noopener noreferrer"
              href={brandHelpCenterURL}
            >
              Help Center
            </SidenavBlankLink>
          </SideNavItem>

          <SupportTrigger />
        </SidenavListGroup>
      </ScrollableArea>

      <UserMenu user={user} />
      <PoweredBy />
    </Sidenav>
  )
}
