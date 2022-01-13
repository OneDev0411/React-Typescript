import React from 'react'

import { Divider, makeStyles } from '@material-ui/core'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import {
  mdiViewGridOutline,
  mdiAccountSupervisorOutline,
  mdiChartArc,
  mdiChatProcessingOutline,
  mdiAlarmLightOutline,
  mdiHelpCircleOutline,
  mdiPhoneOutline,
  mdiMenuUp,
  mdiMenuDown
} from '@mdi/js'
import { useDispatch, useSelector } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
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
      margin: theme.spacing(0, 1)
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

  const [expanded, setExpanded] = React.useState<string | false>(false)

  const handleChange =
    (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
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
            expanded={expanded === 'nav-dashboard'}
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
                      size="14px"
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
            expanded={expanded === 'nav-people'}
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
                      size="14px"
                      rightMargined
                    />
                    People
                  </AccordionSummaryDiv>
                  {expanded === 'nav-people' ? (
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
                  <InlineBadge
                    badgeContent={inboxNotificationNumber}
                    color="primary"
                  >
                    <SideNavItemLabel>Inbox</SideNavItemLabel>
                  </InlineBadge>
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
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === 'nav-marketing'}
            onChange={handleChange('nav-marketing')}
          >
            <AccordionSummary
              aria-controls="nav-marketing-content"
              id="nav-marketing-header"
            >
              <Acl.Marketing>
                <SidenavLink active={false} to="" data-tour-id="nav-marketing">
                  <AccordionSummaryDiv>
                    <SvgIcon path={mdiChartArc} size="14px" rightMargined />
                    Marketing
                  </AccordionSummaryDiv>
                  {expanded === 'nav-marketing' ? (
                    <SvgIcon path={mdiMenuUp} size="24px" />
                  ) : (
                    <SvgIcon path={mdiMenuDown} size="24px" />
                  )}
                </SidenavLink>
              </Acl.Marketing>
            </AccordionSummary>
            <AccordionDetails>
              <Acl.Marketing>
                <SideNavLinkItem to="/dashboard/flows" tourId="nav-flows">
                  <SideNavItemLabel>Flows</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl.Marketing>

              <SideNavLinkItem to="/dashboard/mls" tourId="nav-properties">
                <SideNavItemLabel>Properties</SideNavItemLabel>
              </SideNavLinkItem>

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

              <Acl access={dealsAccess}>
                <SideNavLinkItem to="/dashboard/deals" tourId="nav-deals">
                  <InlineBadge
                    badgeContent={dealsNotificationsNumber}
                    color="primary"
                  >
                    <SideNavItemLabel>Deals</SideNavItemLabel>
                  </InlineBadge>
                </SideNavLinkItem>
              </Acl>

              <Acl access={listingsAccess}>
                <SideNavLinkItem to="/dashboard/listings" tourId="nav-listings">
                  <SideNavItemLabel>Listings</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl>

              <Acl access={ACL.WEBSITES}>
                <SideNavLinkItem to="/dashboard/websites" tourId="nav-websites">
                  <SideNavItemLabel>Websites</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl>

              <Acl access={ACL.SHOWINGS}>
                <SideNavLinkItem to="/dashboard/showings">
                  <InlineBadge
                    badgeContent={showingsTotalNotificationCount}
                    color="primary"
                  >
                    <SideNavItemLabel>Showings</SideNavItemLabel>
                  </InlineBadge>
                </SideNavLinkItem>
              </Acl>
            </AccordionDetails>
          </Accordion>
          <Divider className={classes.divider} />
        </SidenavListGroup>

        <SidenavListGroup>
          {user && (
            <Accordion
              expanded={expanded === 'nav-chat'}
              onChange={handleChange('nav-chat')}
            >
              <AccordionSummary
                aria-controls="nav-chat-content"
                id="nav-chat-header"
              >
                <SideNavItem>
                  <MessagesDrawerTrigger>
                    <InlineBadge
                      badgeContent={chatRoomsNotificationsNumber}
                      color="primary"
                    >
                      <SvgIcon
                        path={mdiChatProcessingOutline}
                        size="14px"
                        rightMargined
                      />
                      Chat
                    </InlineBadge>
                  </MessagesDrawerTrigger>
                </SideNavItem>
              </AccordionSummary>
            </Accordion>
          )}

          {user && (
            <Accordion
              expanded={expanded === 'nav-notifications'}
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
                    <SvgIcon
                      path={mdiAlarmLightOutline}
                      size="14px"
                      rightMargined
                    />
                    <InlineBadge
                      badgeContent={appNotifications}
                      color="primary"
                    >
                      Notifications
                    </InlineBadge>
                  </AccordionSummaryDiv>
                </SidenavLink>
              </AccordionSummary>
            </Accordion>
          )}
          <Divider className={classes.divider} />
        </SidenavListGroup>
        <SidenavListGroup>
          <Accordion
            expanded={expanded === 'nav-help-center'}
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
                      size="14px"
                      rightMargined
                    />
                    Help Center
                  </AccordionSummaryDiv>
                </SidenavBlankLink>
              </SideNavItem>
            </AccordionSummary>
          </Accordion>

          <Accordion
            expanded={expanded === 'nav-support'}
            onChange={handleChange('nav-support')}
          >
            <AccordionSummary
              aria-controls="nav-support-content"
              id="nav-support-header"
            >
              <SideNavItem>
                <SupportTrigger>
                  <InlineBadge
                    badgeContent={chatRoomsNotificationsNumber}
                    color="primary"
                  >
                    <SvgIcon path={mdiPhoneOutline} size="14px" rightMargined />
                    Support
                  </InlineBadge>
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
