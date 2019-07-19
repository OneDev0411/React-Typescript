import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactGA from 'react-ga'
import { Helmet } from 'react-helmet'

import AppDispatcher from '../dispatcher/AppDispatcher'
import Load from '../loader'

import getBrand from '../store_actions/brand'
import VerificationBanner from './Pages/Dashboard/Partials/VerificationBanner'

// services
import ChatSocket from '../services/socket/chat'
import DealSocket from '../services/socket/deals'
import ContactSocket from '../services/socket/contacts'
import NotificationSocket from '../services/socket/Notifications'

// navs
import SideNav from './Pages/Dashboard/SideNav'

// global chat components
import { getRooms } from '../store_actions/chatroom'

// get user roles
import { getUserTeams } from '../store_actions/user/teams'
import { hasUserAccess, viewAsEveryoneOnTeam } from '../utils/user-teams'

// deals featch on launch
import { getDeals, searchDeals } from '../store_actions/deals'

// sync offline stored data
import syncOpenHouseData from './helpers/sync-open-house-offline-registers'

const InstantChat = Load({
  loader: () => import('./Pages/Dashboard/Chatroom/InstantChat')
})

// contacts definitions
import { getAttributeDefs } from '../store_actions/contacts'
import { isLoadedContactAttrDefs } from '../reducers/contacts/attributeDefs'

// favorites
import { selectListings } from '../reducers/listings'
import getFavorites from '../store_actions/listings/favorites/get-favorites'

import AppStore from '../stores/AppStore'
import Brand from '../controllers/Brand'

import config from '../../config/public'

import Intercom from './Pages/Dashboard/Partials/Intercom'
import { inactiveIntercom, activeIntercom } from '../store_actions/intercom'
import { getAllNotifications } from '../store_actions/notifications'

import { checkBrowser } from './helpers/check-browser'

class App extends Component {
  componentWillMount() {
    // check branding
    this.getBrand()

    if (typeof window !== 'undefined') {
      window.Intercom &&
        window.Intercom('onShow', () => this.props.dispatch(activeIntercom()))

      import('offline-js')

      if (!('WebkitAppearance' in document.documentElement.style)) {
        import('simplebar')
      }
    }

    // start chat socket
    new ChatSocket(this.props.user)
  }

  componentDidMount() {
    this.initializeApp()
  }

  componentDidCatch(error, info) {
    if (window.Raven) {
      window.Raven.captureException(error)
      window.Raven.captureMessage('Something happened', {
        ...info
      })
    }
  }

  componentWillUnmount() {
    this.props.dispatch(inactiveIntercom())
  }

  static getDerivedStateFromError(error) {
    console.error(error)

    return { hasError: true }
  }

  async initializeApp() {
    const { data, deals, dispatch } = this.props
    let { user } = this.props

    if (user) {
      if (!user.teams || !user.teams[0].brand.roles) {
        user = {
          ...user,
          teams: await dispatch(getUserTeams(user))
        }
      }

      const isBackOffice = hasUserAccess(user, 'BackOffice')

      this.hasCrmAccess = hasUserAccess(user, 'CRM')
      this.hasDealsAccess = hasUserAccess(user, 'Deals') || isBackOffice

      // load rooms
      this.initialRooms()

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

      // load contacts
      if (
        (this.hasCrmAccess || this.hasDealsAccess) &&
        !isLoadedContactAttrDefs(this.props.contactsAttributeDefs)
      ) {
        dispatch(getAttributeDefs())
      }

      // init sockets
      this.initializeSockets(user)

      // load notifications
      dispatch(getAllNotifications())

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

    dispatch(checkBrowser())

    if (user) {
      dispatch(syncOpenHouseData(user.access_token))
    }
  }

  getBrand() {
    this.props.dispatch(getBrand())
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
      <React.Fragment>
        <Helmet>
          <title>Rechat</title>
        </Helmet>
        <div className="u-scrollbar">
          {user && !user.email_confirmed && (
            <VerificationBanner email={user.email} />
          )}

          <SideNav data={data} location={location} />

          {user && <InstantChat user={user} rooms={rooms} />}

          <main className="l-app__main">{children}</main>

          <Intercom />
        </div>
      </React.Fragment>
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

export default connect(mapStateToProps)(App)
