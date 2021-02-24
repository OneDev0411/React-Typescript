import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

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
import { DashboardLayout } from './DashboardLayout'

class Dashboard extends Component {
  UNSAFE_componentWillMount() {
    const { user, dispatch } = this.props

    if (user) {
      new ChatSocket(user)
    }

    if (typeof window !== 'undefined') {
      if (window.Intercom) {
        window.Intercom('hide')
        window.Intercom('onShow', () => dispatch(activeIntercom()))
      }

      if (!('WebkitAppearance' in document.documentElement.style)) {
        import('simplebar')
      }
    }
  }

  componentDidMount() {
    this.init()
  }

  componentWillUnmount() {
    const { user, dispatch } = this.props

    dispatch(inactiveIntercom())

    if (user && hasUserAccess(user, 'CRM')) {
      window.removeEventListener('online', this.handleOnlineEvent)
    }
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

    dispatch(syncOpenHouseData(user.access_token))

    if (this.hasCrmAccess) {
      // fetch the number of unread email threads
      dispatch(fetchUnreadEmailThreadsCount())

      window.addEventListener('online', this.handleOnlineEvent)
    }
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

    // don't remove below codes,
    // because app is depended to `path` and `location` props in data store
    data.path = location.pathname
    data.location = location

    return (
      <CheckBrowser id={this.props.params.id}>
        <Helmet>
          <title>Rechat | Dashboard</title>
        </Helmet>
        <div className="u-scrollbar">
          {user && !user.email_confirmed && !user.fake_email && (
            <EmailVerificationBanner show email={user.email} />
          )}

          {user && <InstantChat user={user} rooms={rooms} />}

          <DashboardLayout>
            {React.cloneElement(this.props.children, {
              data,
              user
            })}
          </DashboardLayout>

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

export default withRouter(connect(mapStateToProps)(Dashboard))
