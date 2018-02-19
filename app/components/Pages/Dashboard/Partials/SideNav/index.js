import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Dropdown } from 'react-bootstrap'
import Avatar from './components/Avatar'
import Intercom from '../Intercom'
import IntercomTrigger from '../IntercomTrigger'
import TeamSwitcher from './components/TeamSwitcher'
import Brand from '../../../../../controllers/Brand'

// utils
import { getActiveTeamACL } from '../../../../../utils/user-teams'

// chatroom stuff
import Inbox from '../../Chatroom/Shared/instant-trigger'

// deals notification badge counter
import DealsNotifications from '../../Deals/components/SideNavBadge'

const ACTIVE_COLOR = `#${Brand.color('primary', '3388ff')}`
// const DEFAULT_COLOR = '#8da2b5'

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
    default:
      return ''
  }
}

const SideNavItem = ({ children, isActive }) => (
  <li className={`c-app-sidenav__item ${isActive ? 'is-active' : ''}`}>
    <span
      className="c-app-sidenav__item__active-sign"
      style={{ backgroundColor: ACTIVE_COLOR }}
    />
    {children}
  </li>
)

const appSideNav = ({ user, activePath, appNotifications }) => {
  const acl = getActiveTeamACL(user)

  const hasDealsPermission = acl.includes('Deals')
  const hasBackOfficePermission = acl.includes('BackOffice')
  const hasContactsPermission =
    user.user_type !== 'Client' ||
    (user.features && user.features.includes('Contacts'))

  return (
    <aside className="c-app-sidenav">
      <ul className="c-app-sidenav__list c-app-sidenav__list--top">
        <SideNavItem>
          <Inbox />
        </SideNavItem>

        <SideNavItem isActive={activePath === 'MAP'}>
          <Link to="/dashboard/mls" className="c-app-sidenav__item__title">
            MLS
          </Link>
        </SideNavItem>

        {hasContactsPermission && (
          <SideNavItem isActive={activePath === 'CONTACTS'}>
            <Link
              to="/dashboard/contacts"
              className="c-app-sidenav__item__title"
            >
              Contacts
            </Link>
          </SideNavItem>
        )}

        {(hasDealsPermission || hasBackOfficePermission) && (
          <SideNavItem isActive={activePath === 'DEALS'}>
            <Link to="/dashboard/deals" className="c-app-sidenav__item__title">
              Deals
              <DealsNotifications />
            </Link>
          </SideNavItem>
        )}

        {user.agent &&
          user.user_type === 'Agent' &&
          user.agent.office_mlsid === 'CSTPP01' && (
            <SideNavItem isActive={activePath === 'STORE'}>
              <Link to="/dashboard/website">Store</Link>
            </SideNavItem>
          )}
      </ul>

      <ul className="c-app-sidenav__list c-app-sidenav__list--bottom">
        <SideNavItem isActive={activePath === 'NOTIF'}>
          <Link
            to="/dashboard/notifications"
            className="c-app-sidenav__item__title"
          >
            Updates
            {appNotifications > 0 && (
              <span className="c-app-sidenav__notification-badge">
                {appNotifications}
              </span>
            )}
          </Link>
        </SideNavItem>

        <IntercomTrigger
          render={({ activeIntercom, intercomIsActive }) => (
            <SideNavItem isActive={false}>
              <button
                onClick={!intercomIsActive ? activeIntercom : () => false}
                className="c-app-sidenav__item__title--button"
              >
                Support
              </button>
            </SideNavItem>
          )}
        />

        <Dropdown
          dropup
          id="account-dropdown"
          className="c-app-sidenav__account-dropdown"
        >
          <Dropdown.Toggle className="c-app-sidenav__item__title--button">
            <Avatar user={user} size={30} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <TeamSwitcher user={user} />

            <li className="separator">Settings</li>

            <li>
              <Link to="/dashboard/account">Account</Link>
            </li>

            {hasBackOfficePermission && (
              <li>
                <Link to="/dashboard/brands">Brands</Link>
              </li>
            )}
            {user.user_type === 'Admin' && (
              <li>
                <Link to="/dashboard/forms">Forms</Link>
              </li>
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
      </ul>

      <Intercom />
    </aside>
  )
}

export default connect(({ data, user }, { location }) => ({
  user,
  activePath: getActivePath(location.pathname),
  appNotifications: data.new_notifications_count || 0
}))(appSideNav)
