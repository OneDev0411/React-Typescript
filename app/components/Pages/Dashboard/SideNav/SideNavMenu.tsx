import { useState } from 'react'

import { makeStyles } from '@material-ui/core'
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
import { ThunkDispatch } from 'redux-thunk'

import { ACL } from '@app/constants/acl'
import { useUnsafeActiveBrand } from '@app/hooks/brand'
import { InboxAction } from '@app/reducers/inbox/types'
import { WithRouterProps } from '@app/routes/types'
import { withRouter } from '@app/routes/with-router'
import { selectIntercom } from '@app/selectors/intercom'
import { selectUserUnsafe } from '@app/selectors/user'
import { fetchUnreadEmailThreadsCount } from '@app/store_actions/inbox'
import { activateIntercom } from '@app/store_actions/intercom'
import { getBrandHelpCenterURL } from '@app/utils/brand'
import { useAcl } from '@app/views/components/Acl/use-acl'
import { GlobalActionsButton } from '@app/views/components/GlobalActionsButton'
import { ScrollableArea } from '@app/views/components/ScrollableArea'

import useEmailThreadEvents from '../Inbox/helpers/use-email-thread-events'

import { GlobalActionButtonComponent } from './components/GlobalActionButtonComponent'
import Logo from './components/Logo'
import PoweredBy from './components/PoweredBy'
import SideNavAccordion from './components/SideNavAccordion'
import { SideNavToggleButton } from './components/SideNavToggleButton'
import { UserMenu } from './components/UserMenu'
import useNotificationBadgesContext from './notificationBadgesContext/useNotificationBadgesContext'
import { AccordionMenu, BaseAccordionMenu, ExpandedMenu } from './types'
import { appSidenavWidth, scrollableAreaShadowColor } from './variables'

const openHouseAccess = [ACL.CRM, ACL.MARKETING]
const dealsAccess = { oneOf: [ACL.DEALS, ACL.BACK_OFFICE] }
const insightAccess = { oneOf: [ACL.MARKETING, ACL.CRM] }
const dashboardAccess = { oneOf: [ACL.CRM, ACL.DEALS] }
const marketingAccess = {
  oneOf: [ACL.MARKETING, ACL.AGENT_NETWORK, ACL.WEBSITES, ACL.CRM]
}
const transactionsAccess = {
  oneOf: [ACL.DEALS, ACL.BACK_OFFICE, ACL.MARKETING, ACL.SHOWINGS, ACL.CRM]
}
const listingsAccess = { oneOf: [ACL.DEALS, ACL.BACK_OFFICE, ACL.MARKETING] }

const useStyles = makeStyles(
  theme => ({
    sidenav: {
      width: appSidenavWidth,
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      zIndex: theme.zIndex.sideNavDrawer,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.navbar.background.color
    }
  }),
  {
    name: 'SideNavMenu'
  }
)

function SideNavMenu(props: WithRouterProps) {
  const classes = useStyles()
  const user = useSelector(selectUserUnsafe)
  const brand = useUnsafeActiveBrand()

  const { badges } = useNotificationBadgesContext()

  const { isActive: isIntercomActive } = useSelector(selectIntercom)
  const dispatch = useDispatch<ThunkDispatch<any, any, InboxAction>>()

  function handleEmailThreadEvent(): void {
    dispatch(fetchUnreadEmailThreadsCount())
  }

  useEmailThreadEvents(handleEmailThreadEvent, handleEmailThreadEvent)

  // This is initially implemented for DE because they're using a
  // white-labeled version of help.rechat.com
  const brandHelpCenterURL = getBrandHelpCenterURL(brand!)

  const [expandedMenu, setExpandedMenu] = useState<ExpandedMenu>(null)

  const handleOpenSupportDialogueBox = () => {
    if (isIntercomActive) {
      return
    }

    dispatch(activateIntercom(isIntercomActive))
  }

  const handleOpenExternalLink = link =>
    window.open(link, '_blank', 'noopener noreferrer')

  const menuItems: AccordionMenu[] = [
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
      access: ['CRM'],
      hasChildrenNotification: !!badges.unread_email_threads,
      hasDivider: false,
      icon: mdiAccountMultipleOutline,
      id: 'people',
      label: 'People',
      subMenu: [
        {
          access: ['CRM'],
          id: 'contacts',
          isHidden: !useAcl(['CRM']),
          label: 'Contacts',
          to: '/dashboard/contacts'
        },
        {
          access: ['CRM'],
          id: 'calendar',
          isHidden: !useAcl(['CRM']),
          label: 'Calendar',
          to: '/dashboard/calendar'
        },
        {
          access: ['CRM'],
          id: 'tasks',
          isHidden: !useAcl(['CRM']),
          label: 'Tasks',
          to: '/dashboard/tasks'
        },
        {
          access: ['CRM'],
          id: 'inbox',
          isHidden: !useAcl(['CRM']),
          label: 'Inbox',
          notificationCount: badges.unread_email_threads,
          to: '/dashboard/inbox'
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
          isHidden: !useAcl(['Marketing']),
          label: 'Overview',
          to: '/dashboard/marketing'
        },
        {
          access: ['CRM'],
          id: 'flows',
          isHidden: !useAcl(['CRM']),
          label: 'Flows',
          to: '/dashboard/flows'
        },
        {
          access: ['AgentNetwork'],
          id: 'agent-network',
          isHidden: !useAcl(['AgentNetwork']),
          label: 'Agent Network',
          to: '/dashboard/agent-network'
        },
        {
          access: ACL.WEBSITES,
          id: 'websites',
          isHidden: !useAcl([ACL.WEBSITES]),
          label: 'Websites',
          to: '/dashboard/websites'
        },
        {
          access: ACL.BETA,
          id: 'presentations',
          isHidden: !useAcl([ACL.BETA, ACL.WEBSITES]),
          label: 'Presentations',
          to: '/dashboard/presentations'
        },
        {
          access: insightAccess,
          id: 'insight',
          isHidden: !useAcl(insightAccess),
          label: 'Insight',
          to: '/dashboard/insights'
        }
      ]
    },
    {
      hasDivider: false,
      icon: mdiHomeCityOutline,
      id: 'search',
      label: 'Search',
      subMenu: [
        {
          id: 'properties',
          label: 'Properties',
          to: '/dashboard/mls'
        },
        {
          access: ['CRM'],
          id: 'tours',
          isHidden: !useAcl(openHouseAccess),
          label: 'Tours',
          to: '/dashboard/tours'
        }
      ]
    },
    {
      access: transactionsAccess,
      hasChildrenNotification: !!(
        badges.deal_notifications || badges.showing_notifications
      ),
      hasDivider: true,
      icon: mdiCurrencyUsd,
      id: 'transactions',
      label: 'Transactions',
      subMenu: [
        {
          access: dealsAccess,
          id: 'deals',
          isHidden: !useAcl(dealsAccess),
          label: 'Deals',
          notificationCount: badges.deal_notifications,
          to: '/dashboard/deals'
        },
        {
          access: listingsAccess,
          id: 'listings',
          isHidden: !useAcl(listingsAccess),
          label: 'Listings',
          to: '/dashboard/listings'
        },
        {
          access: openHouseAccess,
          id: 'open-house',
          isHidden: !useAcl(['CRM']),
          label: 'Open House',
          to: '/dashboard/open-house'
        },
        {
          access: ACL.SHOWINGS,
          id: 'showings',
          isHidden: !useAcl([ACL.SHOWINGS]),
          label: 'Showings',
          notificationCount: badges.showing_notifications,
          to: '/dashboard/showings'
        }
      ]
    },
    {
      hasDivider: false,
      icon: mdiBellOutline,
      id: 'notifications',
      isHidden: !user,
      label: 'Notifications',
      notificationCount: badges.generic,
      to: '/dashboard/notifications'
    },
    {
      hasDivider: false,
      icon: mdiHeadphones,
      id: 'support',
      isHidden: !user,
      label: 'Support',
      subMenu: [
        {
          id: 'help-center',
          label: 'Help Center',
          action: () => handleOpenExternalLink(brandHelpCenterURL)
        },
        {
          id: 'customer-support',
          label: 'Customer Support',
          action: handleOpenSupportDialogueBox
        }
      ]
    }
  ]

  const filteredMenuItems = menuItems.filter(menu => !menu.isHidden)

  return (
    <aside className={classes.sidenav}>
      <SideNavToggleButton />
      <Logo />
      <GlobalActionsButton renderButton={GlobalActionButtonComponent} />

      <ScrollableArea
        shadowColor={scrollableAreaShadowColor}
        style={{ flex: '1 1' }}
        hasThinnerScrollbar
      >
        {filteredMenuItems.map((menu: BaseAccordionMenu, index) => {
          const { isHidden } = menu

          if (isHidden) {
            return null
          }

          return (
            <SideNavAccordion
              key={index}
              data={menu}
              expandedMenu={expandedMenu}
              onExpandMenu={setExpandedMenu}
            />
          )
        })}
      </ScrollableArea>

      <UserMenu />
      <PoweredBy />
    </aside>
  )
}

export default withRouter(SideNavMenu)
