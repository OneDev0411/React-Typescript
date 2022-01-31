import { useState, ChangeEvent, useEffect, useRef } from 'react'

import { Accordion, AccordionSummary, makeStyles } from '@material-ui/core'
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
import { browserHistory, withRouter, WithRouterProps } from 'react-router'
import { ThunkDispatch } from 'redux-thunk'

import { toggleChatbar } from '@app/store_actions/chatroom'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { fetchUnreadEmailThreadsCount } from 'actions/inbox'
import { GlobalActionsButton } from 'components/GlobalActionsButton'
import { MenuBadge } from 'components/MenuBadge'
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
import SupportTrigger from './components/SupportTrigger'
import { UserMenu } from './components/UserMenu'
import {
  Sidenav,
  SidenavBlankLink,
  SideNavItem,
  SidenavListGroup,
  AccordionSummaryDiv,
  AccordionSummaryLabel
} from './styled'
import { ExpandedMenu, scrollableAreaShadowColor } from './variables'

const useStyles = makeStyles(
  theme => ({
    divider: {
      backgroundColor: theme.palette.grey[800],
      margin: theme.spacing(0.75, 1)
    },
    accordionRoot: {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      '&:before': {
        height: '0'
      }
    },
    accordionExpanded: {
      // I had to add !important to force accordion styles to change
      margin: '0 !important'
    },
    accordionSummaryRoot: {
      padding: 0,
      // I had to add !important to force accordionSummary styles to change
      minHeight: `${theme.spacing(5.5)}px !important`
    },
    accordionSummaryRootExpanded: {
      // Added primary color to the root menu's svg-icon, when it is expanded
      '& svg:first-child': {
        color: theme.palette.primary.main
      }
    },
    accordionSummaryContent: {
      display: 'flex',
      justifyContent: 'flex-start',
      // I had to add !important to force accordionSummary styles to change
      margin: '0 !important'
    },
    AccordionDetailsRoot: {
      padding: 0,
      flexDirection: 'column'
    }
  }),
  {
    name: 'SideNavMenu'
  }
)

const openHouseAccess = [ACL.CRM, ACL.MARKETING]
const dealsAccess = { oneOf: [ACL.DEALS, ACL.BACK_OFFICE] }
const insightAccess = { oneOf: [ACL.MARKETING, ACL.CRM] }
const dashboardAccess = { oneOf: [ACL.CRM, ACL.DEALS] }
const listingsAccess = { oneOf: [ACL.DEALS, ACL.BACK_OFFICE, ACL.MARKETING] }

function Menu(props: WithRouterProps) {
  const classes = useStyles()
  const {
    location: { pathname }
  } = props
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

  const handleChange =
    (panel: ExpandedMenu) => (event: ChangeEvent<{}>, isExpanded: boolean) => {
      setExpandedMenu(isExpanded ? panel : null)
    }

  // We need to save the last page the user visited in local storage(I defined the last-visited-route variable)
  // to show that page to him/her on next time visited the site
  // if the user opens several tabs, we need to save the last tab he/she closed
  // so I count and increase the number of tabs that the user opens
  // and save it to local storage(I defined the how-many-tabs-is-open variable)
  // and decreased it when the user closes a tab
  // to decide should I update last-visited-route variable or not
  const didMountRef: any = useRef()

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true

      const lastVisitedRoute = localStorage.getItem('last-visited-route')

      const howManyTabsIsOpen = Number(
        localStorage.getItem('how-many-tabs-is-open')
      )

      if (howManyTabsIsOpen > 0) {
        // If this is not the first browser tab, it will increase the how-many-tabs-is-open variable
        localStorage.setItem(
          'how-many-tabs-is-open',
          (howManyTabsIsOpen + 1).toString()
        )
      } else {
        // If this is the first browser tab, it will set the how-many-tabs-is-open variable to 1
        localStorage.setItem('how-many-tabs-is-open', '1')
      }

      // It will remove the last-visited-route variable to prevent future posibility bugs
      localStorage.removeItem('last-visited-route')

      lastVisitedRoute && browserHistory.push(lastVisitedRoute)
    } else {
      // When the user clicked on the close browser tab button this function will trigger
      window.onbeforeunload = () => {
        const howManyTabsIsOpen = Number(
          localStorage.getItem('how-many-tabs-is-open')
        )

        if (howManyTabsIsOpen === 1) {
          // It saves last-visited-route and remove how-many-tabs-is-open variable when the last browser tab is closed
          localStorage.setItem('last-visited-route', pathname)
          localStorage.removeItem('how-many-tabs-is-open')
        } else {
          // If this is not the last browser tab it will decrease the how-many-tabs-is-open variable
          localStorage.setItem(
            'how-many-tabs-is-open',
            (howManyTabsIsOpen - 1).toString()
          )
        }
      }
    }
  })

  const openDrawer = () => {
    if (!window.location.pathname.includes('/recents/')) {
      dispatch(toggleChatbar())
    }
  }

  const MenuItems = [
    {
      access: dashboardAccess,
      label: 'dashboard',
      icon: mdiViewGridOutline,
      hasDivider: true,
      testId: 'side-nav-list',
      to: ['/dashboard/overview']
    },
    {
      access: ['Marketing', 'AgentNetwork'],
      label: 'marketing',
      icon: mdiChartArc,
      hasDivider: false,
      testId: '',
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
      testId: '',
      to: ['/dashboard/mls']
    },
    {
      access: dashboardAccess,
      label: 'people',
      icon: mdiAccountMultiple,
      hasChildrenNotification:
        inboxNotificationNumber || chatRoomsNotificationsNumber,
      hasDivider: false,
      testId: '',
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
          isHidden: !user,
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
      testId: '',
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
      isHidden: !user,
      label: 'notifications',
      icon: mdiBellOutline,
      notifCount: appNotifications,
      hasDivider: true,
      testId: '',
      to: ['/dashboard/notifications']
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

        <SidenavListGroup>
          <Accordion
            expanded={expandedMenu === 'nav-help-center'}
            onChange={handleChange('nav-help-center')}
            classes={{
              root: classes.accordionRoot,
              expanded: classes.accordionExpanded
            }}
          >
            <AccordionSummary
              aria-controls="nav-help-center-content"
              id="nav-help-center-header"
              classes={{
                root: classes.accordionSummaryRoot,
                expanded: classes.accordionSummaryRootExpanded,
                content: classes.accordionSummaryContent
              }}
            >
              <SideNavItem>
                <SidenavBlankLink
                  target="_blank"
                  rel="noopener noreferrer"
                  href={brandHelpCenterURL}
                >
                  <AccordionSummaryDiv>
                    <SvgIcon
                      path={mdiHelpCircleOutline}
                      size={muiIconSizes.small}
                      rightMargined
                    />

                    <AccordionSummaryLabel>Help Center</AccordionSummaryLabel>
                  </AccordionSummaryDiv>
                </SidenavBlankLink>
              </SideNavItem>
            </AccordionSummary>
          </Accordion>

          <Accordion
            expanded={expandedMenu === 'nav-support'}
            onChange={handleChange('nav-support')}
            classes={{
              root: classes.accordionRoot,
              expanded: classes.accordionExpanded
            }}
          >
            <AccordionSummary
              aria-controls="nav-support-content"
              id="nav-support-header"
              classes={{
                root: classes.accordionSummaryRoot,
                expanded: classes.accordionSummaryRootExpanded,
                content: classes.accordionSummaryContent
              }}
            >
              <SideNavItem>
                <SupportTrigger>
                  <MenuBadge
                    badgeContent={chatRoomsNotificationsNumber}
                    color="primary"
                  >
                    <SvgIcon
                      path={mdiPhoneOutline}
                      size={muiIconSizes.small}
                      rightMargined
                    />

                    <AccordionSummaryLabel>Support</AccordionSummaryLabel>
                  </MenuBadge>
                </SupportTrigger>
              </SideNavItem>
            </AccordionSummary>
          </Accordion>
        </SidenavListGroup>
      </ScrollableArea>

      <UserMenu user={user} />
      <PoweredBy />
    </Sidenav>
  )
}

export default withRouter(Menu)
