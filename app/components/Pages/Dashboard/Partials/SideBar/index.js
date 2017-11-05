// Sidebar.js
import S from 'shorti'
import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Link, browerHistory } from 'react-router'
import Intercom from 'react-intercom'
import { Dropdown } from 'react-bootstrap'

import SvgMap from '../Svgs/Map'
import SvgStore from '../Svgs/Store'
import SvgPeople from '../Svgs/People'
import SvgBriefCase from '../Svgs/BriefCase'
import SvgSupport from '../Svgs/Support'
import SvgNotifications from '../Svgs/Notifications'
import Brand from '../../../../../controllers/Brand'
import Avatar from './components/Avatar'

// utils
import { hasUserAccess, getUserRoles } from '../../../../../utils/user-acl'

// chatroom stuff
import InstantChatTrigger from '../../Chatroom/Shared/instant-trigger'

// deals notification badge counter
import DealsIcon from '../../Deals/components/sidebar-badge'

const ACTIVE_COLOR = `#${Brand.color('primary', '3388ff')}`
const DEFAULT_COLOR = '#4e5c6c'

const getActivePath = path => {
  switch (path) {
    case '/dashboard/mls':
    case '/dashboard/mls/alerts':
    case '/dashboard/mls/actives':
      return 'MAP'
    case '/dashboard/contacts':
      return 'CONTACTS'
    case '/dashboard/notifications':
      return 'NOTIF'
    case '/dashboard/website':
      return 'STORE'
    case (path.match(/\/dashboard\/deals/) || {}).input:
      return 'DEALS'
    default:
      return ''
  }
}

const getNotificationIcon = data => {
  let icon
  if (data.new_notifications_count && data.new_notifications_count > 0) {
    icon = (
      <div style={S('absolute t-5n r-15')}>
        <div style={S('font-15 bg-db3821 br-100 p-6 h-17 text-center')}>
          <span style={S('color-fff font-10 relative t-9n')}>
            {data.new_notifications_count}
          </span>
        </div>
      </div>
    )
  }
  return icon
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

const NavbarItem = ({ title, children }) => (
  <li
    data-balloon={title}
    data-balloon-pos="right"
    className="c-app-navbar__item"
  >
    {children}
  </li>
)

const SupportButton = ({ onClick, isActive }) => (
  <NavbarItem title="Support">
    <button onClick={onClick} className="c-app-navbar__support-btn">
      <SvgSupport color={isActive ? ACTIVE_COLOR : DEFAULT_COLOR} />
    </button>
  </NavbarItem>
)

const appNavbar = ({
  data,
  user,
  activePath,
  activeIntercom,
  intercomIsActive,
  unactiveIntercom
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
    <aside className="c-app-navbar">
      <InstantChatTrigger />

      <ul className="c-app-navbar__list c-app-navbar__list--top">
        <NavbarItem title="Listings">
          <Link to="/dashboard/mls">
            <SvgMap
              color={activePath === 'MAP' ? ACTIVE_COLOR : DEFAULT_COLOR}
            />
          </Link>
        </NavbarItem>

        {user.user_type !== 'Client' && (
          <NavbarItem title="Contacts">
            <Link to="/dashboard/contacts">
              <SvgPeople
                color={activePath === 'CONTACTS' ? ACTIVE_COLOR : DEFAULT_COLOR}
              />
            </Link>
          </NavbarItem>
        )}

        {(hasDealsPermission || hasBackOfficePermission) && (
          <NavbarItem title="Deals">
            <Link to="/dashboard/deals">
              <DealsIcon
                color={activePath === 'DEALS' ? ACTIVE_COLOR : DEFAULT_COLOR}
              />
            </Link>
          </NavbarItem>
        )}

        {user.agent &&
          user.user_type === 'Agent' &&
          user.agent.office_mlsid === 'CSTPP01' && (
            <NavbarItem title="Store">
              <Link to="/dashboard/website">
                <SvgStore
                  color={activePath === 'Store' ? ACTIVE_COLOR : DEFAULT_COLOR}
                />
              </Link>
            </NavbarItem>
          )}
      </ul>

      <ul className="c-app-navbar__list c-app-navbar__list--bottom">
        <NavbarItem title="Notifications">
          <Link to="/dashboard/notifications">
            {getNotificationIcon(data)}
            <SvgNotifications
              color={activePath === 'NOTIF' ? ACTIVE_COLOR : DEFAULT_COLOR}
            />
          </Link>
        </NavbarItem>

        <SupportButton onClick={activeIntercom} isActive={intercomIsActive} />

        <Dropdown
          dropup
          id="account-dropdown"
          data-balloon="Settings"
          data-balloon-pos="right"
          className="c-app-navbar__account-dropdown"
        >
          <Dropdown.Toggle>
            <Avatar user={user} />
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
    data,
    user,
    activePath: getActivePath(location.pathname)
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
