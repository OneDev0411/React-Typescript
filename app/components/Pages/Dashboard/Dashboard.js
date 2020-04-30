import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { browserHistory, withRouter } from 'react-router'

import asyncComponentLoader from '../../../loader'

const InstantChat = asyncComponentLoader({
  loader: () => import('./Chatroom/InstantChat')
})

import ChatSocket from '../../../services/socket/chat'
import DealSocket from '../../../services/socket/deals'
import ContactSocket from '../../../services/socket/contacts'
import NotificationSocket from '../../../services/socket/Notifications'

import { selectListings } from '../../../reducers/listings'

import {
  inactiveIntercom,
  activeIntercom
} from '../../../store_actions/intercom'
import { getRooms } from '../../../store_actions/chatroom'
import { getAttributeDefs } from '../../../store_actions/contacts'
import { getDeals, searchDeals } from '../../../store_actions/deals'
import { getAllNotifications } from '../../../store_actions/notifications'
import { isLoadedContactAttrDefs } from '../../../reducers/contacts/attributeDefs'
import getFavorites from '../../../store_actions/listings/favorites/get-favorites'
import { fetchUnreadEmailThreadsCount } from '../../../store_actions/inbox'

import CheckBrowser from '../../../views/components/CheckBrowser'
import Intercom from '../../../views/components/Intercom'
import EmailVerificationBanner from '../../../views/components/EmailVerificationBanner'

import { hasUserAccess, viewAsEveryoneOnTeam } from '../../../utils/user-teams'

import syncOpenHouseData from '../../helpers/sync-open-house-offline-registers'

import SideNav from './SideNav'

class App extends Component {
  componentWillMount() {
    const { user, dispatch } = this.props

    if (!user) {
      const redirectPathname = '/signout'

      browserHistory.push(redirectPathname)
      window.location.href = redirectPathname

      return
    }

    if (typeof window !== 'undefined') {
      window.Intercom &&
        window.Intercom('onShow', () => dispatch(activeIntercom()))

      if (!('WebkitAppearance' in document.documentElement.style)) {
        import('simplebar')
      }
    }

    new ChatSocket(user)
  }

  componentDidMount() {
    this.init()
  }

  componentWillUnmount() {
    this.props.dispatch(inactiveIntercom())

    window.removeEventListener('online', this.handleOnlineEvent)
  }

  async init() {
    const { user, deals, dispatch } = this.props

    if (!user) {
      return
    }

    const isBackOffice = hasUserAccess(user, 'BackOffice')

    this.hasCrmAccess = hasUserAccess(user, 'CRM')
    this.hasDealsAccess = hasUserAccess(user, 'Deals') || isBackOffice

    dispatch(getRooms())

    // load deals
    if (
      this.hasDealsAccess &&
      Object.keys(deals).length === 0 &&
      !this.props.isFetchingDeals
    ) {
      if (isBackOffice || viewAsEveryoneOnTeam(user)) {
        dispatch(getDeals(user))
      } else {
        dispatch(searchDeals(user))
      }
    }

    // load CRM attributes definition
    if (
      (this.hasCrmAccess || this.hasDealsAccess) &&
      !isLoadedContactAttrDefs(this.props.contactsAttributeDefs)
    ) {
      dispatch(getAttributeDefs())
    }

    this.initializeSockets(user)

    dispatch(getAllNotifications())

    // Get MLS favorites
    dispatch(getFavorites(user))

    // fetch the number of unread email threads
    dispatch(fetchUnreadEmailThreadsCount())

    dispatch(syncOpenHouseData(user.access_token))

    window.addEventListener('online', this.handleOnlineEvent)
  }

  initializeSockets(user) {
    new NotificationSocket(user)

    if (this.hasCrmAccess) {
      new ContactSocket(user)
    }

    if (this.hasDealsAccess) {
      new DealSocket(user)
    }
  }

  handleOnlineEvent = () => {
    // update the number of unread emails in Inbox nav link notification badge
    this.props.dispatch(fetchUnreadEmailThreadsCount())
  }

  render() {
    const { data, user, rooms, location } = this.props

    if (!user) {
      return null
    }

    // don't remove below codes,
    // because app is depended to `path` and `location` props in data store
    data.path = location.pathname
    data.location = location

    const children = React.cloneElement(this.props.children, {
      data,
      user
    })

    return (
      <CheckBrowser id={this.props.params.id}>
        <Helmet>
          <title>Rechat | Dashboard</title>
        </Helmet>
        <div className="u-scrollbar">
          {user && !user.email_confirmed && (
            <EmailVerificationBanner show email={user.email} />
          )}

          <SideNav location={location} />

          {user && <InstantChat user={user} rooms={rooms} />}

          <main className="l-app__main">{children}</main>

          <Intercom />
        </div>
      </CheckBrowser>
    )
  }
}

function mapStateToProps(state) {
  return {
    contactsAttributeDefs: state.contacts.attributeDefs,
    data: state.data,
    deals: state.deals.list,
    isFetchingDeals: state.deals.properties.isFetchingDeals,
    favoritesListings: selectListings(state.favorites.listings),
    rooms: state.chatroom.rooms,
    user: state.user
  }
}

export default withRouter(connect(mapStateToProps)(App))
