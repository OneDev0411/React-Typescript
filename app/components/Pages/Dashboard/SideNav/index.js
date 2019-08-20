import React, { useCallback, useState } from 'react'
import { connect } from 'react-redux'

import { ScrollableArea } from '../../../../views/components/ScrollableArea'

import { ACL } from '../../../../constants/acl'
import LoginIcon from '../../../../views/components/SvgIcons/Login/LoginIcon'
import DealsIcon from '../../../../views/components/SvgIcons/Deals/IconDeal'
import DealsIconActive from '../../../../views/components/SvgIcons/Deals/IconDealActive'
import StoreIcon from '../../../../views/components/SvgIcons/Marketing/IconMarketing'
import StoreIconActive from '../../../../views/components/SvgIcons/Marketing/IconMarketingActive'
import MarketingIcon from '../../../../views/components/SvgIcons/PencilRuler/IconPencilRuler'
import MarketingIconActive from '../../../../views/components/SvgIcons/PencilRuler/IconPencilRulerActive'
import ContactsIcon from '../../../../views/components/SvgIcons/Contacts/IconContacts'
import ContactsIconActive from '../../../../views/components/SvgIcons/Contacts/IconContactsActive'
import NotificationsIcon from '../../../../views/components/SvgIcons/Notifications/IconNotifications'
import NotificationsIconActive from '../../../../views/components/SvgIcons/Notifications/IconNotificationsActive'
import SupportIcon from '../../../../views/components/SvgIcons/Support/IconSupport'
import MarketingInsightsIcon from '../../../../views/components/SvgIcons/MarketingInsights/IconMarketingInsights'
import MarketingInsightsIconActive from '../../../../views/components/SvgIcons/MarketingInsights/IconMarketingInsightsActive'
import PropertiesIcon from '../../../../views/components/SvgIcons/Properties/IconProperties'
import PropertiesIconActive from '../../../../views/components/SvgIcons/Properties/IconPropertiesActive'
import CalendarIcon from '../../../../views/components/SvgIcons/Calendar2/IconCalendar'
import CalendarIconActive from '../../../../views/components/SvgIcons/Calendar2/IconCalendarActive'
import IconCog from '../../../../views/components/SvgIcons/Cog/IconCog'
import IconCogActive from '../../../../views/components/SvgIcons/Cog/IconCogActive'
import DealsNotifications from '../Deals/components/SideNavBadge'

import { selectNotificationNewCount } from '../../../../reducers/notifications'

import Acl from '../../../../views/components/Acl'

import Inbox from '../Chatroom/Shared/instant-trigger'
import Brand from '../../../../controllers/Brand'
import IntercomTrigger from '../Partials/IntercomTrigger'
import { SideNavTooltip } from './components/Tooltip'
import { UserMenu } from './components/UserMenu'
import { SideNavLinkItem } from './components/SideNavLinkItem'
import { SideNavItem } from './components/SideNavItem'
import {
  Sidenav,
  SidenavBadge,
  SidenavIconButton,
  SidenavLink,
  SidenavList
} from './styled'

const hasWebsitePermission = user =>
  user &&
  user.agent &&
  user.user_type === 'Agent' &&
  user.agent.office_mlsid === 'CSTPP01'

function AppSideNav(props) {
  const [isMenuOpen, setMenuOpen] = useState(false)

  const toggleMenu = useCallback(() => setMenuOpen(isOpen => !isOpen), [])

  const brandLogoSrc =
    (!user && Brand.asset('office_logo')) || '/static/images/appicon.png'

  const { user, appNotifications } = props

  return (
    <Sidenav>
      <UserMenu
        user={user}
        open={isMenuOpen}
        onToggle={toggleMenu}
        brandLogoSrc={brandLogoSrc}
      />

      <ScrollableArea style={{ flex: '1 1' }} hasThinnerScrollbar>
        <SidenavList data-test="side-nav-list">
          <Acl.Crm>
            <SideNavLinkItem
              tooltip="Calendar"
              to="/dashboard/calendar"
              Icon={CalendarIcon}
              ActiveIcon={CalendarIconActive}
            />
          </Acl.Crm>

          <Acl.Crm>
            <SideNavLinkItem
              tooltip="Contacts"
              to="/dashboard/contacts"
              Icon={ContactsIcon}
              ActiveIcon={ContactsIconActive}
            />
          </Acl.Crm>

          <Acl access={{ oneOf: [ACL.DEALS, ACL.BACK_OFFICE] }}>
            <SideNavLinkItem
              tooltip="Your Deals"
              to="/dashboard/deals"
              Icon={DealsIcon}
              ActiveIcon={DealsIconActive}
            >
              <DealsNotifications />
            </SideNavLinkItem>
          </Acl>

          <Acl.Marketing>
            <SideNavLinkItem
              tooltip="Marketing Center"
              to="/dashboard/marketing"
              Icon={MarketingIcon}
              ActiveIcon={MarketingIconActive}
            />
          </Acl.Marketing>

          <Acl.Marketing>
            <SideNavLinkItem
              tooltip="Email Insights"
              to="/dashboard/insights"
              Icon={MarketingInsightsIcon}
              ActiveIcon={MarketingInsightsIconActive}
            />
          </Acl.Marketing>

          <SideNavLinkItem
            tooltip="All MLS® Properties"
            to="/dashboard/mls"
            Icon={PropertiesIcon}
            ActiveIcon={PropertiesIconActive}
          />

          {user && (
            <SideNavItem>
              <Inbox />
            </SideNavItem>
          )}

          <Acl access={hasWebsitePermission}>
            <SideNavLinkItem
              tooltip="Store"
              to="/dashboard/website"
              Icon={StoreIcon}
              ActiveIcon={StoreIconActive}
            />
          </Acl>
        </SidenavList>
      </ScrollableArea>
      <SidenavList>
        {user && (
          <SideNavLinkItem
            tooltip="Account Settings"
            to="/dashboard/account"
            Icon={IconCog}
            ActiveIcon={IconCogActive}
          />
        )}

        {user && (
          <SideNavLinkItem
            tooltip="Notifications"
            to="/dashboard/notifications"
            Icon={NotificationsIcon}
            ActiveIcon={NotificationsIconActive}
          >
            {appNotifications > 0 && (
              <SidenavBadge>
                {appNotifications > 99 ? '99+' : appNotifications}
              </SidenavBadge>
            )}
          </SideNavLinkItem>
        )}

        <IntercomTrigger
          render={({ activeIntercom, intercomIsActive }) => (
            <SideNavItem>
              <SideNavTooltip caption="Support">
                <SidenavIconButton
                  inverse
                  onClick={!intercomIsActive ? activeIntercom : () => false}
                >
                  <SupportIcon />
                </SidenavIconButton>
              </SideNavTooltip>
            </SideNavItem>
          )}
        />

        {!user && (
          <SideNavItem>
            <SideNavTooltip caption="Login">
              <SidenavLink
                inverse
                to={`/signin?redirectTo=${encodeURIComponent(
                  window.location.pathname
                )}`}
              >
                <LoginIcon />
              </SidenavLink>
            </SideNavTooltip>
          </SideNavItem>
        )}
      </SidenavList>
    </Sidenav>
  )
}

export default connect(({ globalNotifications, user }) => ({
  user,
  appNotifications: selectNotificationNewCount(globalNotifications)
}))(AppSideNav)
