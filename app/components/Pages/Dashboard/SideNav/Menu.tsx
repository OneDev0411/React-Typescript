import { useState, ChangeEvent } from 'react'

import {
  mdiGamepadCircleUp,
  mdiAccountMultipleOutline,
  mdiBullhornOutline,
  mdiCurrencyUsd,
  mdiBellOutline,
  mdiHeadphones,
  mdiHomeCityOutline
} from '@mdi/js'
import { useDispatch, useSelector } from 'react-redux'
import { withRouter, WithRouterProps } from 'react-router'
import { ThunkDispatch } from 'redux-thunk'

import { toggleChatbar } from '@app/store_actions/chatroom'
import { activateIntercom } from '@app/store_actions/intercom'
import { fetchUnreadEmailThreadsCount } from 'actions/inbox'
import { GlobalActionsButton } from 'components/GlobalActionsButton'
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
import { ScrollableArea } from 'views/components/ScrollableArea'

import useEmailThreadEvents from '../Inbox/helpers/use-email-thread-events'

import Logo from './components/Logo'
import PoweredBy from './components/PoweredBy'
import SideNavAccordion from './components/SideNavAccordion'
import { UserMenu } from './components/UserMenu'
import { Sidenav } from './styled'
import { ExpandedMenu, AccordionMenu, AccordionSubMenu } from './types'
import { scrollableAreaShadowColor } from './variables'

const openHouseAccess = [ACL.CRM, ACL.MARKETING]
const dealsAccess = { oneOf: [ACL.DEALS, ACL.BACK_OFFICE] }
const insightAccess = { oneOf: [ACL.MARKETING, ACL.CRM] }
const dashboardAccess = { oneOf: [ACL.CRM, ACL.DEALS] }
const marketingAccess = { oneOf: [ACL.MARKETING, ACL.AGENT_NETWORK] }
const listingsAccess = { oneOf: [ACL.DEALS, ACL.BACK_OFFICE, ACL.MARKETING] }
const allAccess = {
  oneOf: [
    ACL.DEALS,
    ACL.BACK_OFFICE,
    ACL.MARKETING,
    ACL.CRM,
    ACL.MARKETING,
    ACL.AGENT_NETWORK
  ]
}

function Menu(props: WithRouterProps) {
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
  const showingsTotalNotificationCount = useSelector(
    selectShowingsTotalNotificationCount
  )
  const { isActive: isIntercomActive } = useSelector(
    (state: IAppState) => state.intercom
  )
  const dealsNotificationsNumber = useDealsNotificationsNumber()
  const chatRoomsNotificationsNumber = useChatRoomsNotificationsNumber()
  const dispatch = useDispatch<ThunkDispatch<any, any, InboxAction>>()

  function handleEmailThreadEvent(): void {
    dispatch(fetchUnreadEmailThreadsCount())
  }

  useEmailThreadEvents(handleEmailThreadEvent, handleEmailThreadEvent)

  // This is initially implemented for DE because they're using a
  // white-labeled version of help.rechat.com
  const brandHelpCenterURL = getBrandHelpCenterURL(brand)

  const [expandedMenu, setExpandedMenu] = useState<ExpandedMenu>(null)

  const handleChange =
    (panel: ExpandedMenu) => (event: ChangeEvent<{}>, isExpanded: boolean) => {
      setExpandedMenu(isExpanded ? panel : null)
    }

  const handleOpenChatbarDrawer = () =>
    !window.location.pathname.includes('/recents/') && dispatch(toggleChatbar())

  const handleOpenSupportDialogueBox = () =>
    !isIntercomActive && dispatch(activateIntercom(isIntercomActive))

  const handleOpenExternalLink = link =>
    window.open(link, '_blank', 'noopener noreferrer')

  const MenuItems: AccordionMenu[] = [
    {
      access: dashboardAccess,
      hasDivider: false,
      icon: mdiGamepadCircleUp,
      id: 'home',
      label: 'Today',
      testId: 'side-nav-list',
      to: '/dashboard/overview'
    },
    {
      access: dashboardAccess,
      hasChildrenNotification: !!(
        inboxNotificationNumber || chatRoomsNotificationsNumber
      ),
      hasDivider: false,
      icon: mdiAccountMultipleOutline,
      id: 'people',
      label: 'People',
      subMenu: [
        {
          access: ['CRM'],
          id: 'contacts',
          label: 'Contacts',
          to: '/dashboard/contacts'
        },
        {
          access: ['CRM'],
          id: 'calendar',
          label: 'Calendar',
          to: '/dashboard/calendar'
        },
        {
          access: ['CRM'],
          id: 'inbox',
          label: 'Inbox',
          notificationCount: inboxNotificationNumber,
          to: '/dashboard/inbox'
        },
        {
          access: ['CRM'],
          id: 'chat',
          label: 'Chat',
          isHidden: !user,
          notificationCount: chatRoomsNotificationsNumber,
          action: handleOpenChatbarDrawer
        }
      ]
    },
    {
      access: marketingAccess,
      hasDivider: false,
      icon: mdiBullhornOutline,
      id: 'marketing',
      label: 'Marketing',
      subMenu: [
        {
          access: ['Marketing'],
          id: 'overview',
          label: 'Overview',
          to: '/dashboard/marketing'
        },
        {
          access: ['Marketing'],
          id: 'automation',
          label: 'Automation',
          to: '/dashboard/flows'
        },
        {
          access: ['AgentNetwork'],
          id: 'agent-network',
          label: 'Agent Network',
          to: '/dashboard/agent-network'
        },
        {
          access: ACL.WEBSITES,
          id: 'websites',
          label: 'Websites',
          to: '/dashboard/websites'
        },
        {
          access: insightAccess,
          id: 'insight',
          label: 'Insight',
          to: '/dashboard/insights'
        }
      ]
    },
    {
      access: ['Marketing'],
      hasDivider: false,
      icon: mdiHomeCityOutline,
      id: 'search',
      label: 'Search',
      subMenu: [
        {
          access: ['Marketing'],
          id: 'properties',
          label: 'Properties',
          to: '/dashboard/mls'
        },
        {
          access: openHouseAccess,
          id: 'tours',
          label: 'Tours',
          to: '/dashboard/tours'
        }
      ]
    },
    {
      access: ['Marketing'],
      hasChildrenNotification: !!(
        dealsNotificationsNumber || showingsTotalNotificationCount
      ),
      hasDivider: true,
      icon: mdiCurrencyUsd,
      id: 'transactions',
      label: 'Transactions',
      subMenu: [
        {
          access: dealsAccess,
          id: 'deals',
          label: 'Deals',
          notificationCount: dealsNotificationsNumber,
          to: '/dashboard/deals'
        },
        {
          access: listingsAccess,
          id: 'listings',
          label: 'Listings',
          to: '/dashboard/listings'
        },
        {
          access: ['CRM'],
          id: 'open-house',
          label: 'Open House',
          to: '/dashboard/open-house'
        },
        {
          access: ACL.SHOWINGS,
          id: 'showings',
          label: 'Showings',
          notificationCount: showingsTotalNotificationCount,
          to: '/dashboard/showings'
        }
      ]
    },
    {
      access: ['Marketing'],
      hasDivider: false,
      icon: mdiBellOutline,
      id: 'notifications',
      isHidden: !user,
      label: 'Notifications',
      notificationCount: appNotifications,
      to: '/dashboard/notifications'
    },
    {
      access: allAccess,
      hasDivider: false,
      icon: mdiHeadphones,
      id: 'support',
      label: 'Support',
      subMenu: [
        {
          access: allAccess,
          id: 'help-center',
          label: 'Help Center',
          action: () => handleOpenExternalLink(brandHelpCenterURL)
        },
        {
          access: allAccess,
          id: 'customer-support',
          label: 'Customer Support',
          action: handleOpenSupportDialogueBox
        }
      ]
    }
  ]

  return (
    <Sidenav>
      <Logo />
      <GlobalActionsButton />
      <ScrollableArea
        shadowColor={scrollableAreaShadowColor}
        style={{ flex: '1 1' }}
        hasThinnerScrollbar
      >
        {MenuItems.map((menu: AccordionSubMenu, index) => (
          <SideNavAccordion
            key={index}
            data={menu}
            onChange={handleChange}
            expandedMenu={expandedMenu}
            setExpandedMenu={setExpandedMenu}
          />
        ))}
      </ScrollableArea>

      <UserMenu user={user} />
      <PoweredBy />
    </Sidenav>
  )
}

export default withRouter(Menu)
