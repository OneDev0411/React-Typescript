import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Link, browerHistory } from 'react-router'
import Intercom from 'react-intercom'
import { Dropdown } from 'react-bootstrap'
import Avatar from './components/Avatar'

import Brand from '../../../../../controllers/Brand'

// utils
import { hasUserAccess, getUserRoles } from '../../../../../utils/user-acl'

// chatroom stuff
import Inbox from '../../Chatroom/Shared/instant-trigger'

// deals notification badge counter
import DealsNotifications from '../../Deals/components/SideNavBadge'

const ACTIVE_COLOR = `#${Brand.color('primary', '3388ff')}`
const DEFAULT_COLOR = '#8da2b5'

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

const IntercomCloseButton = ({ onClick }) => (
  <button onClick={onClick} className="intercom__close-btn">
    <svg
      fill="#333"
      height="32"
      viewBox="0 0 24 24"
      width="32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  </button>
)

const SideNavItem = ({ children, isActive }) => (
  <li
    className={`c-app-sidenav__item ${isActive ? 'is-active' : ''}`}
  >
    <span
      className="c-app-sidenav__item__active-sign"
      style={{ backgroundColor: ACTIVE_COLOR }}
    />
    {children}
  </li>
)

const appNavbar = ({
  user,
  activePath,
  activeIntercom,
  intercomIsActive,
  unactiveIntercom,
  appNotifications
}) => {
  const intercomUser = {
    user_id: user.id,
    email: user.email,
    name: `${user.first_name} ${user.last_name}`
  }

  const roles = getUserRoles(user)
  const hasDealsPermission = roles.includes('Deals')
  const hasBackOfficePermission = roles.includes('BackOffice')

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

        {user.user_type !== 'Client' && (
          <SideNavItem isActive={activePath === 'CONTACTS'}>
            <Link to="/dashboard/contacts" className="c-app-sidenav__item__title">
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
          <Link to="/dashboard/notifications" className="c-app-sidenav__item__title">
            Updates
            {appNotifications > 0 && (
              <span className="c-app-sidenav__notification-badge">
                {appNotifications}
              </span>
            )}
          </Link>
        </SideNavItem>

        <SideNavItem isActive={intercomIsActive}>
          <button
            onClick={activeIntercom}
            className="c-app-sidenav__item__title--button"
          >
            Support
          </button>
        </SideNavItem>

        <Dropdown
          dropup
          id="account-dropdown"
          className="c-app-sidenav__account-dropdown"
        >
          <Dropdown.Toggle className="c-app-sidenav__item__title--button">
            <Avatar user={user} size={30} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
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
                onClick={event => {
                  window.localStorage.removeItem('verificationBanner')
                }}
              >
                Sign out
              </a>
            </li>
          </Dropdown.Menu>
        </Dropdown>
      </ul>

      {window.INTERCOM_ID && (
        <Intercom appID={window.INTERCOM_ID} {...intercomUser} />
      )}
      {intercomIsActive && <IntercomCloseButton onClick={unactiveIntercom} />}
    </aside>
  )
}

export default compose(
  connect(({ data, user }, { location }) => ({
    user,
    activePath: getActivePath(location.pathname),
    appNotifications: data.new_notifications_count || 0
  })),
  withState('intercomIsActive', 'setIntercomIsActive', false),
  withHandlers({
    activeIntercom: ({ intercomIsActive, setIntercomIsActive }) => () => {
      if (!intercomIsActive) {
        window.Intercom('show')
        setIntercomIsActive(true)
      }
    },
    unactiveIntercom: ({ intercomIsActive, setIntercomIsActive }) => () => {
      window.Intercom('hide')
      setIntercomIsActive(false)
    }
  })
)(appNavbar)
