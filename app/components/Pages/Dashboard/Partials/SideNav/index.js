import React from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'
import { Dropdown, MenuItem } from 'react-bootstrap'

import IntercomTrigger from '../IntercomTrigger'

import Brand from '../../../../../controllers/Brand'

// utils
import { getActiveTeamACL } from '../../../../../utils/user-teams'

// chatroom stuff
import Inbox from '../../Chatroom/Shared/instant-trigger'

// deals notification badge counter
import DealsNotifications from '../../Deals/components/SideNavBadge'
import { selectNotificationNewCount } from '../../../../../reducers/notifications'

import Badge from '../../../../../views/components/Badge'
import IconButton from '../../../../../views/components/Button/IconButton'
import Link from '../../../../../views/components/Button/LinkButton'
import LoginIcon from '../../../../../views/components/SvgIcons/Login/LoginIcon'
import DealsIcon from '../../../../../views/components/SvgIcons/Deals/IconDeal'
import StoreIcon from '../../../../../views/components/SvgIcons/Marketing/IconMarketing'
import MarketingIcon from '../../../../../views/components/SvgIcons/PencilRuler/IconPencilRuler'
import ContactsIcon from '../../../../../views/components/SvgIcons/Contacts/IconContacts'
import NotificationsIcon from '../../../../../views/components/SvgIcons/Notifications/IconNotifications'
import SupportIcon from '../../../../../views/components/SvgIcons/Support/IconSupport'
import CalendarIcon from '../../../../../views/components/SvgIcons/Calendar2/IconCalendar'
import IconProperties from '../../../../../views/components/SvgIcons/Properties/IconProperties'

import TeamSwitcher from './components/TeamSwitcher'
import { SideNavTooltip } from './components/Tooltip'
import { SettingsDropdownButton } from './components/SettingsDropdownButton'

const getActivePath = path => {
  const checkPath = filter => (path.match(filter) || {}).input

  switch (path) {
    case checkPath(/\/dashboard\/mls/):
      return 'MAP'
    case checkPath(/\/dashboard\/contacts/):
      return 'CONTACTS'
    case '/dashboard/notifications':
      return 'NOTIF'
    case '/dashboard/website':
      return 'STORE'
    case checkPath(/\/dashboard\/deals/):
      return 'DEALS'
    case checkPath(/\/dashboard\/marketing/):
      return 'MARKETING'
    case checkPath(/\/dashboard\/insights/):
      return 'INSIGHTS'
    case checkPath(/\/dashboard\/calendar/):
      return 'CALENDAR'

    default:
      return ''
  }
}

const SideNavItem = ({ isActive, children }) => (
  <li className={`c-app-sidenav__item ${isActive ? 'is-active' : ''}`}>
    {children}
  </li>
)

class appSideNav extends React.Component {
  state = {
    isDropDownOpen: false
  }

  onToggle = isDropDownOpen => this.setState({ isDropDownOpen })

  render() {
    let brandLogoSrc = '/static/images/appicon.png'
    let hasAdminPermission
    let hasDealsPermission
    let hasBackOfficePermission
    let hasContactsPermission
    let hasMarketingPermission
    let hasWebsitePermission
    const { user, activePath, appNotifications } = this.props

    if (user) {
      const acl = getActiveTeamACL(user)

      hasAdminPermission = acl.includes('Admin')
      hasDealsPermission = acl.includes('Deals')
      hasBackOfficePermission = acl.includes('BackOffice')
      hasContactsPermission = acl.includes('CRM')
      hasMarketingPermission = acl.includes('Marketing')
      hasWebsitePermission =
        user.agent &&
        user.user_type === 'Agent' &&
        user.agent.office_mlsid === 'CSTPP01'
    } else if (Brand.asset('office_logo')) {
      brandLogoSrc = Brand.asset('office_logo')
    }

    return (
      <aside className="c-app-sidenav">
        {user ? (
          <Dropdown
            dropup
            id="account-dropdown"
            className="c-app-sidenav__account-dropdown"
            onToggle={this.onToggle}
          >
            <SettingsDropdownButton
              user={user}
              bsRole="toggle"
              isDropDownOpen={this.state.isDropDownOpen}
            />

            <Dropdown.Menu>
              <TeamSwitcher user={user} />

              {user.teams && user.teams.length > 1 && (
                <li className="separator">Account</li>
              )}

              <MenuItem href="/dashboard/account">Settings</MenuItem>

              {hasAdminPermission && (
                <React.Fragment>
                  <li role="separator" className="divider" />
                  <li>
                    <Link to="/dashboard/brands">Brands</Link>
                  </li>
                </React.Fragment>
              )}
              <li role="separator" className="divider" />
              <li>
                <a
                  href="/signout"
                  onClick={() => {
                    window.localStorage.removeItem('verificationBanner')
                  }}
                >
                  Sign out
                </a>
              </li>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Flex center style={{ padding: '0.75em 0' }}>
            <Link to="/">
              <img src={brandLogoSrc} alt="Rechat" width="32" height="32" />
            </Link>
          </Flex>
        )}
        <ul className="c-app-sidenav__list">
          {hasContactsPermission && (
            <SideNavItem isActive={activePath === 'CALENDAR'}>
              <SideNavTooltip caption="Calendar">
                <Link
                  inverse
                  to="/dashboard/calendar"
                  className="c-app-sidenav__item__title"
                >
                  <CalendarIcon />
                </Link>
              </SideNavTooltip>
            </SideNavItem>
          )}

          {user && (
            <SideNavItem>
              <Inbox />
            </SideNavItem>
          )}

          <SideNavItem isActive={activePath === 'MAP'}>
            <SideNavTooltip caption="Properties">
              <Link
                inverse
                to="/dashboard/mls"
                className="c-app-sidenav__item__title"
              >
                <IconProperties />
              </Link>
            </SideNavTooltip>
          </SideNavItem>

          {hasContactsPermission && (
            <SideNavItem isActive={activePath === 'CONTACTS'}>
              <SideNavTooltip caption="Contacts">
                <Link
                  inverse
                  to="/dashboard/contacts"
                  className="c-app-sidenav__item__title"
                >
                  <ContactsIcon />
                </Link>
              </SideNavTooltip>
            </SideNavItem>
          )}

          {(hasDealsPermission || hasBackOfficePermission) && (
            <SideNavItem isActive={activePath === 'DEALS'}>
              <SideNavTooltip caption="Deals">
                <Link
                  inverse
                  to="/dashboard/deals"
                  className="c-app-sidenav__item__title"
                >
                  <DealsIcon />
                  <DealsNotifications />
                </Link>
              </SideNavTooltip>
            </SideNavItem>
          )}

          {hasWebsitePermission && (
            <SideNavItem isActive={activePath === 'STORE'}>
              <SideNavTooltip caption="Store">
                <Link
                  inverse
                  to="/dashboard/website"
                  className="c-app-sidenav__item__title"
                >
                  <StoreIcon />
                </Link>
              </SideNavTooltip>
            </SideNavItem>
          )}

          {hasMarketingPermission && (
            <SideNavItem isActive={activePath === 'MARKETING'}>
              <SideNavTooltip caption="Marketing Center">
                <Link
                  inverse
                  to="/dashboard/marketing"
                  className="c-app-sidenav__item__title"
                >
                  <MarketingIcon />
                </Link>
              </SideNavTooltip>
            </SideNavItem>
          )}

          {hasMarketingPermission && (
            <SideNavItem isActive={activePath === 'INSIGHTS'}>
              <SideNavTooltip caption="Marketing Insights">
                <Link
                  inverse
                  to="/dashboard/insights"
                  className="c-app-sidenav__item__title"
                >
                  <CalendarIcon />
                </Link>
              </SideNavTooltip>
            </SideNavItem>
          )}
        </ul>

        <ul className="c-app-sidenav__list c-app-sidenav__list--bottom">
          {user && (
            <SideNavItem isActive={activePath === 'NOTIF'}>
              <SideNavTooltip caption="Notifications">
                <Link
                  inverse
                  to="/dashboard/notifications"
                  className="c-app-sidenav__item__title"
                >
                  <NotificationsIcon style={{ width: 24, height: 24 }} />
                  {appNotifications > 0 && (
                    <Badge
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%'
                      }}
                    >
                      {appNotifications > 99 ? '99+' : appNotifications}
                    </Badge>
                  )}
                </Link>
              </SideNavTooltip>
            </SideNavItem>
          )}

          <IntercomTrigger
            render={({ activeIntercom, intercomIsActive }) => (
              <SideNavItem isActive={false}>
                <SideNavTooltip caption="Support">
                  <IconButton
                    iconSize="XLarge"
                    inverse
                    onClick={!intercomIsActive ? activeIntercom : () => false}
                    className="c-app-sidenav__item__title--button"
                  >
                    <SupportIcon />
                  </IconButton>
                </SideNavTooltip>
              </SideNavItem>
            )}
          />

          {!user && (
            <SideNavItem>
              <SideNavTooltip caption="Login">
                <Link
                  inverse
                  to={`/signin?redirectTo=${encodeURIComponent(
                    window.location.pathname
                  )}`}
                  className="c-app-sidenav__item__title"
                >
                  <LoginIcon />
                </Link>
              </SideNavTooltip>
            </SideNavItem>
          )}
        </ul>
      </aside>
    )
  }
}

export default connect(({ globalNotifications, user }, { location }) => ({
  user,
  activePath: getActivePath(location.pathname),
  appNotifications: selectNotificationNewCount(globalNotifications)
}))(appSideNav)
