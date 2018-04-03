import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppDispatcher from '../dispatcher/AppDispatcher'
import Load from '../loader'

import getBrand from '../store_actions/brand'
import VerificationBanner from './Pages/Dashboard/Partials/VerificationBanner'

// services
import ChatSocket from './Pages/Dashboard/Chatroom/Services/socket'
import ContactSocket from '../services/socket/contacts'
import DealSocket from './Pages/Dashboard/Deals/services/socket'

// utils
import { hasUserAccess } from '../utils/user-teams'

// navs
import SideNav from './Pages/Dashboard/Partials/SideNav'

// global chat components
import { getRooms } from '../store_actions/chatroom'

// get user roles
import getTeams from '../store_actions/user/teams'

// deals featch on launch
import { getDeals } from '../store_actions/deals'

const InstantChat = Load({
  loader: () => import('./Pages/Dashboard/Chatroom/InstantChat')
})

// contacts
import { getContacts } from '../store_actions/contacts/get-contacts'
import { selectContacts } from '../reducers/contacts/list'

// favorites
import { selectListings } from '../reducers/listings'
import getFavorites from '../store_actions/listings/favorites/get-favorites'

import NotificationDispatcher from '../dispatcher/NotificationDispatcher'
import AppStore from '../stores/AppStore'
import Brand from '../controllers/Brand'
import ReactGA from 'react-ga'
import config from '../../config/public'
import { inactiveIntercom } from '../store_actions/intercom'
import VerifyPhoneNumber from './Partials/VerifyPhoneNumber'

class App extends Component {
  componentWillMount() {
    const { user } = this.props

    // check branding
    this.getBrand()

    if (typeof window !== 'undefined') {
      import('offline-js')

      if (!('WebkitAppearance' in document.documentElement.style)) {
        import('simplebar')
      }

      if (user) {
        this.initializeContactSocket(user)
        this.initializeChatSocket(user)
        this.initializeDealSocket(user)
      }
    }
  }

  componentDidMount() {
    this.initializeApp()
  }

  componentWillUnmount() {
    this.props.dispatch(inactiveIntercom())
  }

  async initializeApp() {
    const { data, deals, dispatch, contactsList } = this.props
    let { user } = this.props

    if (user) {
      if (!user.teams) {
        user = {
          ...user,
          teams: await dispatch(getTeams())
        }
      }

      // load rooms
      this.initialRooms()

      // load deals
      if (!deals) {
        dispatch(getDeals(user, hasUserAccess(user, 'BackOffice')))
      }

      // load contacts
      if (contactsList.length === 0) {
        dispatch(getContacts())
      }

      // load notifications
      this.loadNotifications(data)

      // load saved listings
      dispatch(getFavorites(user))

      // set user for full story
      this.setFullStoryUser(user)

      // set user data for sentry
      this.setSentryUser(user, data.brand)
    }

    // check user is mobile device or not
    this.checkForMobile()

    // branch banner
    this.triggerBranchBanner(user)

    // google analytics
    this.initialGoogleAnalytics(data)
  }

  static async fetchData(dispatch, params) {
    const { user } = params

    if (!user) {
      return Promise.resolve()
    }

    return dispatch(getRooms(user))
  }

  getBrand() {
    this.props.dispatch(getBrand())
  }

  initializeContactSocket(user) {
    new ContactSocket(user)
  }

  initializeChatSocket(user) {
    new ChatSocket(user)
  }

  initializeDealSocket(user) {
    new DealSocket(user)
  }

  async initialRooms() {
    const { dispatch } = this.props

    const rooms = await dispatch(getRooms())

    // hack for share alert modal -> prepare rooms for it
    AppStore.data.rooms = rooms
  }

  checkForMobile() {
    AppDispatcher.dispatch({
      action: 'check-for-mobile'
    })
  }

  loadNotifications(data) {
    if (data.getting_notifications || data.notifications_retrieved) {
      return false
    }

    NotificationDispatcher.dispatch({
      action: 'get-all',
      user: data.user
    })

    AppStore.data.getting_notifications = true
    AppStore.emitChange()
  }

  initialGoogleAnalytics(data) {
    let google_analytics_id = 'UA-56150904-2'
    const brand = Brand.flatten(data.brand)

    if (brand && brand.assets && brand.assets.google_analytics_id) {
      google_analytics_id = brand.assets.google_analytics_id
    }

    ReactGA.initialize(google_analytics_id)
    ReactGA.ga(
      'create',
      google_analytics_id,
      'auto',
      brand && brand.hostnames ? brand.hostnames[0] : 'rechat'
    )
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
  }

  setFullStoryUser(user) {
    if (window.FS) {
      window.FS.identify(user.id, {
        name: user.display_name,
        email: user.email
      })
    }
  }

  setSentryUser(user, brand) {
    if (window.Raven) {
      const { email, id } = user
      const userData = {
        id,
        email,
        name: user.display_name,
        brand: brand && {
          id: brand.id,
          name: brand.name
        }
      }

      window.Raven.setUserContext(userData)
    }
  }

  showMobileSplashViewer() {
    AppStore.data.show_mobile_splash_viewer = true
    this.createBranchLink()
    AppStore.emitChange()
  }

  createBranchLink() {
    const branch = require('branch-sdk')

    branch.init(config.branch.key)

    let branch_data = window.branchData

    if (!branch_data) {
      branch_data = {
        $always_deeplink: true
      }
    }

    branch.link(
      {
        data: branch_data
      },
      (err, link) => {
        AppStore.data.branch_link = link
        AppStore.emitChange()
      }
    )
  }

  triggerBranchBanner(user) {
    if (!user) {
      return false
    }

    const branch = require('branch-sdk')

    branch.init(config.branch.key)
    branch.banner(
      {
        icon: '/static/images/logo-big.png',
        title: 'Download the Rechat iOS app',
        description: 'For a better mobile experience',
        showDesktop: false,
        showAndroid: false,
        forgetHide: false,
        downloadAppButtonText: 'GET',
        openAppButtonText: 'OPEN',
        customCSS:
          '#branch-banner .button { color:  #3388ff; border-color: #3388ff; }'
      },
      {
        data: {
          type: AppStore.data.user
            ? 'WebBranchBannerClickedUser'
            : 'WebBranchBannerClickedShadowUser',
          access_token: AppStore.data.user
            ? AppStore.data.user.access_token
            : null
        }
      }
    )
  }

  render() {
    const { data, user, rooms, location } = this.props

    // don't remove below codes,
    // because app is depended to `path` and `location` props in data store
    data.path = location.pathname
    data.location = location

    const children = React.cloneElement(this.props.children, {
      data,
      user
    })

    return (
      <div className="u-scrollbar">
        {user &&
          !user.email_confirmed && <VerificationBanner email={user.email} />}

        {user && <SideNav data={data} location={location} />}

        {user && <InstantChat user={user} rooms={rooms} />}

        <main className={`l-app__main ${user ? 'is-logged-in' : ''}`}>
          {children}
        </main>

        {user && <VerifyPhoneNumber user={user} unclosable />}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { user, data, favorites, deals, contacts, chatroom } = state
  const { list: contactsList } = contacts

  return {
    data,
    user,
    deals: deals.list,
    rooms: chatroom.rooms,
    favoritesListings: selectListings(favorites.listings),
    contactsList: selectContacts(contactsList)
  }
}

export default connect(mapStateToProps)(App)
