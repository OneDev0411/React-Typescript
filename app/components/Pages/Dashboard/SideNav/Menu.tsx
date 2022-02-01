import { useState, ChangeEvent } from 'react'

import {
  mdiViewGridOutline,
  mdiAccountMultiple,
  mdiChartArc,
  mdiSwapHorizontal,
  mdiBellOutline,
  mdiHelpCircleOutline,
  mdiPhoneOutline,
  mdiHomeCity
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

import AccordionMenu from './components/AccordionMenu'
import Logo from './components/Logo'
import PoweredBy from './components/PoweredBy'
import { UserMenu } from './components/UserMenu'
import { Sidenav } from './styled'
import { ExpandedMenu, scrollableAreaShadowColor } from './variables'

const openHouseAccess = [ACL.CRM, ACL.MARKETING]
const dealsAccess = { oneOf: [ACL.DEALS, ACL.BACK_OFFICE] }
const insightAccess = { oneOf: [ACL.MARKETING, ACL.CRM] }
const dashboardAccess = { oneOf: [ACL.CRM, ACL.DEALS] }
const listingsAccess = { oneOf: [ACL.DEALS, ACL.BACK_OFFICE, ACL.MARKETING] }

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

  const [expandedMenu, setExpandedMenu] = useState<ExpandedMenu>(null)
  const { isActive: isIntercomActive } = useSelector(
    (state: IAppState) => state.intercom
  )

  const handleChange =
    (panel: ExpandedMenu) => (event: ChangeEvent<{}>, isExpanded: boolean) => {
      setExpandedMenu(isExpanded ? panel : null)
    }

  const openDrawer = () => {
    if (!window.location.pathname.includes('/recents/')) {
      dispatch(toggleChatbar())
    }
  }

  const openSupport = () => {
    !isIntercomActive && dispatch(activateIntercom(isIntercomActive))
  }

  const MenuItems = [
    {
      access: dashboardAccess,
      label: 'dashboard',
      icon: mdiViewGridOutline,
      hasDivider: true,
      testId: 'side-nav-list',
      to: '/dashboard/overview'
    },
    {
      access: ['Marketing', 'AgentNetwork'],
      label: 'marketing',
      icon: mdiChartArc,
      hasDivider: false,
      subMenu: [
        {
          label: 'marketing',
          access: ['Marketing'],
          to: '/dashboard/marketing'
        },
        {
          label: 'flows',
          access: ['Marketing'],
          to: '/dashboard/flows'
        },
        {
          label: 'agent-network',
          access: ['AgentNetwork'],
          to: '/dashboard/agent-network'
        },
        {
          label: 'insights',
          access: insightAccess,
          to: '/dashboard/insights'
        },
        {
          label: 'websites',
          access: ACL.WEBSITES,
          to: '/dashboard/websites'
        }
      ]
    },
    {
      access: ['Marketing'],
      label: 'properties',
      icon: mdiHomeCity,
      hasDivider: false,
      to: '/dashboard/mls'
    },
    {
      access: dashboardAccess,
      label: 'people',
      icon: mdiAccountMultiple,
      hasChildrenNotification:
        inboxNotificationNumber || chatRoomsNotificationsNumber,
      hasDivider: false,
      subMenu: [
        {
          label: 'email',
          access: ['CRM'],
          to: '/dashboard/inbox',
          notifCount: inboxNotificationNumber
        },
        {
          label: 'calendar',
          access: ['CRM'],
          to: '/dashboard/calendar'
        },
        {
          label: 'contacts',
          access: ['CRM'],
          to: '/dashboard/contacts'
        },
        {
          label: 'chat',
          isVisible: user,
          access: ['CRM'],
          to: openDrawer,
          notifCount: chatRoomsNotificationsNumber
        }
      ]
    },
    {
      access: ['Marketing'],
      label: 'transactions',
      icon: mdiSwapHorizontal,
      hasChildrenNotification:
        dealsNotificationsNumber || showingsTotalNotificationCount,
      hasDivider: true,
      subMenu: [
        {
          label: 'deals',
          access: dealsAccess,
          to: '/dashboard/deals',
          notifCount: dealsNotificationsNumber
        },
        {
          label: 'listings',
          access: listingsAccess,
          to: '/dashboard/listings'
        },
        {
          label: 'tours',
          access: openHouseAccess,
          to: '/dashboard/tours'
        },
        {
          label: 'open-house',
          access: ['CRM'],
          to: '/dashboard/open-house'
        },
        {
          label: 'showings',
          access: ACL.SHOWINGS,
          to: '/dashboard/showings',
          notifCount: showingsTotalNotificationCount
        }
      ]
    },
    {
      access: ['Marketing'],
      isVisible: user,
      label: 'notifications',
      icon: mdiBellOutline,
      notifCount: appNotifications,
      hasDivider: true,
      to: '/dashboard/notifications'
    },
    {
      access: ['Marketing'],
      label: 'help-center',
      icon: mdiHelpCircleOutline,
      to: brandHelpCenterURL,
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    {
      access: ['CRM'],
      label: 'support',
      icon: mdiPhoneOutline,
      to: openSupport
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
        {MenuItems.map((menu, index) => (
          <AccordionMenu
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
