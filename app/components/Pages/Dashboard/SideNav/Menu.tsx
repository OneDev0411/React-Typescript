import { useState, ChangeEvent } from 'react'

import { Divider, makeStyles } from '@material-ui/core'
import {
  mdiViewGridOutline,
  mdiAccountSupervisorOutline,
  mdiChartArc,
  mdiAlarmLightOutline,
  mdiHelpCircleOutline,
  mdiPhoneOutline,
  mdiMenuUp,
  mdiMenuDown,
  mdiGoogleMaps
} from '@mdi/js'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { fetchUnreadEmailThreadsCount } from 'actions/inbox'
import { GlobalActionsButton } from 'components/GlobalActionsButton'
import { MenuAccordion as Accordion } from 'components/MenuAccordion'
import { MenuAccordionDetails as AccordionDetails } from 'components/MenuAccordionDetails'
import { MenuAccordionSummary as AccordionSummary } from 'components/MenuAccordionSummary'
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
  SidenavLink,
  SideNavItem,
  SideNavItemLabel,
  SidenavListGroup,
  AccordionSummaryDiv
} from './styled'
import { scrollableAreaShadowColor } from './variables'

const useStyles = makeStyles(
  theme => ({
    divider: {
      backgroundColor: theme.palette.grey[800],
      margin: theme.spacing(0.75, 1)
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

type ExpandedMenu =
  | null
  | 'nav-dashboard'
  | 'nav-marketing'
  | 'nav-properties'
  | 'nav-people'
  | 'nav-chat'
  | 'nav-transaction'
  | 'nav-notifications'
  | 'nav-help-center'
  | 'nav-support'

export function Menu() {
  const classes = useStyles()
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
          <Accordion
            expanded={expandedMenu === 'nav-dashboard'}
            onChange={handleChange('nav-dashboard')}
          >
            <AccordionSummary
              aria-controls="nav-dashboard-content"
              id="nav-dashboard-header"
            >
              <Acl access={dashboardAccess}>
                <SidenavLink
                  active={false}
                  to="/dashboard/overview"
                  data-tour-id="nav-dashboard"
                >
                  <AccordionSummaryDiv>
                    <SvgIcon
                      path={mdiViewGridOutline}
                      size={muiIconSizes.small}
                      rightMargined
                    />
                    Dashboard
                  </AccordionSummaryDiv>
                </SidenavLink>
              </Acl>
            </AccordionSummary>
          </Accordion>
          <Divider className={classes.divider} />
        </SidenavListGroup>

        <SidenavListGroup>
          <Accordion
            expanded={expandedMenu === 'nav-marketing'}
            onChange={handleChange('nav-marketing')}
          >
            <AccordionSummary
              aria-controls="nav-marketing-content"
              id="nav-marketing-header"
            >
              <Acl.Marketing>
                <SidenavLink active={false} to="" data-tour-id="nav-marketing">
                  <AccordionSummaryDiv>
                    <SvgIcon
                      path={mdiChartArc}
                      size={muiIconSizes.small}
                      rightMargined
                    />
                    Marketing
                  </AccordionSummaryDiv>
                  {expandedMenu === 'nav-marketing' ? (
                    <SvgIcon path={mdiMenuUp} size="24px" />
                  ) : (
                    <SvgIcon path={mdiMenuDown} size="24px" />
                  )}
                </SidenavLink>
              </Acl.Marketing>
            </AccordionSummary>
            <AccordionDetails>
              <Acl.Marketing>
                <SideNavLinkItem
                  to="/dashboard/marketing"
                  tourId="nav-Overview"
                >
                  <SideNavItemLabel>Overview</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl.Marketing>

              <Acl.Marketing>
                <SideNavLinkItem to="/dashboard/flows" tourId="nav-flows">
                  <SideNavItemLabel>Flows</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl.Marketing>

              <Acl.AgentNetwork>
                <SideNavLinkItem
                  to="/dashboard/agent-network"
                  tourId="nav-agent-network"
                >
                  <SideNavItemLabel>Agent Network</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl.AgentNetwork>

              <Acl access={insightAccess}>
                <SideNavLinkItem to="/dashboard/insights" tourId="nav-insight">
                  <SideNavItemLabel>Insight</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl>

              <Acl access={ACL.WEBSITES}>
                <SideNavLinkItem to="/dashboard/websites" tourId="nav-websites">
                  <SideNavItemLabel>Website</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expandedMenu === 'nav-properties'}
            onChange={handleChange('nav-properties')}
          >
            <AccordionSummary
              aria-controls="nav-properties-content"
              id="nav-properties-header"
            >
              <Acl.Marketing>
                <SidenavLink
                  active={false}
                  to="/dashboard/mls"
                  data-tour-id="nav-properties"
                >
                  <AccordionSummaryDiv>
                    <SvgIcon
                      path={mdiGoogleMaps}
                      size={muiIconSizes.small}
                      rightMargined
                    />
                    Properties
                  </AccordionSummaryDiv>
                </SidenavLink>
              </Acl.Marketing>
            </AccordionSummary>
          </Accordion>

          <Accordion
            expanded={expandedMenu === 'nav-people'}
            onChange={handleChange('nav-people')}
          >
            <AccordionSummary
              aria-controls="nav-people-content"
              id="nav-people-header"
            >
              <Acl access={dashboardAccess}>
                <SidenavLink active={false} to="" data-tour-id="nav-people">
                  <AccordionSummaryDiv>
                    <SvgIcon
                      path={mdiAccountSupervisorOutline}
                      size={muiIconSizes.small}
                      rightMargined
                    />
                    People
                  </AccordionSummaryDiv>
                  {expandedMenu === 'nav-people' ? (
                    <SvgIcon path={mdiMenuUp} size="24px" />
                  ) : (
                    <SvgIcon path={mdiMenuDown} size="24px" />
                  )}
                </SidenavLink>
              </Acl>
            </AccordionSummary>
            <AccordionDetails>
              <Acl.Crm>
                <SideNavLinkItem to="/dashboard/inbox" tourId="nav-inbox">
                  <MenuBadge
                    badgeContent={inboxNotificationNumber}
                    color="primary"
                  >
                    <SideNavItemLabel>Email</SideNavItemLabel>
                  </MenuBadge>
                </SideNavLinkItem>
              </Acl.Crm>

              <Acl.Crm>
                <SideNavLinkItem to="/dashboard/calendar" tourId="nav-calendar">
                  <SideNavItemLabel>Calendar</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl.Crm>

              <Acl.Crm>
                <SideNavLinkItem to="/dashboard/contacts" tourId="nav-contacts">
                  <SideNavItemLabel>Contacts</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl.Crm>

              {user && (
                <Accordion
                  expanded={expandedMenu === 'nav-chat'}
                  onChange={handleChange('nav-chat')}
                >
                  <AccordionSummary
                    aria-controls="nav-chat-content"
                    id="nav-chat-header"
                  >
                    <SideNavItem>
                      <MessagesDrawerTrigger>
                        <MenuBadge
                          badgeContent={chatRoomsNotificationsNumber}
                          color="primary"
                        >
                          Chat
                        </MenuBadge>
                      </MessagesDrawerTrigger>
                    </SideNavItem>
                  </AccordionSummary>
                </Accordion>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expandedMenu === 'nav-transaction'}
            onChange={handleChange('nav-transaction')}
          >
            <AccordionSummary
              aria-controls="nav-transaction-content"
              id="nav-transaction-header"
            >
              <Acl.Marketing>
                <SidenavLink
                  active={false}
                  to=""
                  data-tour-id="nav-transaction"
                >
                  <AccordionSummaryDiv>
                    <SvgIcon
                      path={mdiChartArc}
                      size={muiIconSizes.small}
                      rightMargined
                    />
                    Transactions
                  </AccordionSummaryDiv>
                  {expandedMenu === 'nav-transaction' ? (
                    <SvgIcon path={mdiMenuUp} size="24px" />
                  ) : (
                    <SvgIcon path={mdiMenuDown} size="24px" />
                  )}
                </SidenavLink>
              </Acl.Marketing>
            </AccordionSummary>
            <AccordionDetails>
              <Acl access={dealsAccess}>
                <SideNavLinkItem to="/dashboard/deals" tourId="nav-deals">
                  <MenuBadge
                    badgeContent={dealsNotificationsNumber}
                    color="primary"
                  >
                    <SideNavItemLabel>Deals</SideNavItemLabel>
                  </MenuBadge>
                </SideNavLinkItem>
              </Acl>

              <Acl access={listingsAccess}>
                <SideNavLinkItem to="/dashboard/listings" tourId="nav-listings">
                  <SideNavItemLabel>Listings</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl>

              <Acl.Crm>
                <SideNavLinkItem to="/dashboard/tours" tourId="nav-tours">
                  <SideNavItemLabel>Tours</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl.Crm>

              <Acl access={openHouseAccess}>
                <SideNavLinkItem
                  to="/dashboard/open-house"
                  tourId="nav-open-house"
                >
                  <SideNavItemLabel>Open House</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl>

              <Acl access={ACL.SHOWINGS}>
                <SideNavLinkItem to="/dashboard/showings">
                  <MenuBadge
                    badgeContent={showingsTotalNotificationCount}
                    color="primary"
                  >
                    <SideNavItemLabel>Showings</SideNavItemLabel>
                  </MenuBadge>
                </SideNavLinkItem>
              </Acl>
            </AccordionDetails>
          </Accordion>
          <Divider className={classes.divider} />
        </SidenavListGroup>

        <SidenavListGroup>
          {user && (
            <Accordion
              expanded={expandedMenu === 'nav-notifications'}
              onChange={handleChange('nav-notifications')}
            >
              <AccordionSummary
                aria-controls="nav-notifications-content"
                id="nav-notifications-header"
              >
                <SidenavLink
                  active={false}
                  to="/dashboard/notifications"
                  data-tour-id="nav-notifications"
                >
                  <AccordionSummaryDiv>
                    <MenuBadge badgeContent={appNotifications} color="primary">
                      <SvgIcon
                        path={mdiAlarmLightOutline}
                        size={muiIconSizes.small}
                        rightMargined
                      />
                      Notifications
                    </MenuBadge>
                  </AccordionSummaryDiv>
                </SidenavLink>
              </AccordionSummary>
            </Accordion>
          )}
          <Divider className={classes.divider} />
        </SidenavListGroup>

        <SidenavListGroup>
          <Accordion
            expanded={expandedMenu === 'nav-help-center'}
            onChange={handleChange('nav-help-center')}
          >
            <AccordionSummary
              aria-controls="nav-help-center-content"
              id="nav-help-center-header"
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
                    Help Center
                  </AccordionSummaryDiv>
                </SidenavBlankLink>
              </SideNavItem>
            </AccordionSummary>
          </Accordion>

          <Accordion
            expanded={expandedMenu === 'nav-support'}
            onChange={handleChange('nav-support')}
          >
            <AccordionSummary
              aria-controls="nav-support-content"
              id="nav-support-header"
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
                    Support
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
