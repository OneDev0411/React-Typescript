import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppDispatcher from '../dispatcher/AppDispatcher'
import Load from '../loader'

import getBrand from '../store_actions/brand'
import VerificationBanner from './Pages/Dashboard/Partials/VerificationBanner'

// services
import ChatSocket from '../services/socket/chat'
import DealSocket from '../services/socket/deals'
import ContactSocket from '../services/socket/contacts'

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

// contacts definitions
import { getAttributeDefs } from '../store_actions/contacts'
import { isLoadedContactAttrDefs } from '../reducers/contacts/attributeDefs'

// favorites
import { selectListings } from '../reducers/listings'
import getFavorites from '../store_actions/listings/favorites/get-favorites'

import AppStore from '../stores/AppStore'
import Brand from '../controllers/Brand'
import ReactGA from 'react-ga'
import config from '../../config/public'

import Intercom from './Pages/Dashboard/Partials/Intercom'
import { inactiveIntercom, activeIntercom } from '../store_actions/intercom'
import { getAllNotifications } from '../store_actions/notifications'

import bowser from 'bowser'
import { confirmation } from '../store_actions/confirmation'

class App extends Component {
  componentWillMount() {
    const { user, dispatch } = this.props

    // check branding
    this.getBrand()

    // init sockets
    this.initializeSockets(user)

    if (typeof window !== 'undefined') {
      window.Intercom &&
        window.Intercom('onShow', () => dispatch(activeIntercom()))

      import('offline-js')

      if (!('WebkitAppearance' in document.documentElement.style)) {
        import('simplebar')
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
    const { data, deals, dispatch } = this.props
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
        dispatch(getDeals(user))
      }

      // load contacts
      if (!isLoadedContactAttrDefs(this.props.contactsAttributeDefs)) {
        dispatch(getAttributeDefs())
      }

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

    dispatch(this.checkBrowser())
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

  initializeSockets(user) {
    this.initializeChatSocket(user)
    this.initializeDealSocket(user)
    this.initializeContactSocket(user)
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

  checkBrowser() {
    return async dispatch => {
      const browser = bowser.getParser(window.navigator.userAgent)
      const browserInfo = browser.getBrowser()

      const isValidBrowser = browser.satisfies({
        // declare browsers per OS
        windows: {
          'internet explorer': '>11'
        },
        macos: {
          safari: '>11'
        },

        // or in general
        chrome: '>65',
        firefox: '>60'
      })

      if (!isValidBrowser) {
        let downloadLink

        switch (browserInfo.name) {
          case 'Internet Explorer':
            downloadLink =
              'https://www.microsoft.com/en-us/download/internet-explorer.aspx'
            break
          case 'Chrome':
            downloadLink = 'https://www.google.com/chrome/'
            break
          case 'Firefox':
            downloadLink = 'https://www.mozilla.org/en-US/firefox/new/'
            break
          default:
            break
        }

        dispatch(
          confirmation({
            message: `Your web browser (${browserInfo.name} ${
              browserInfo.version.split('.')[0]
            }) is out of date.`,
            description: (
              <p>
                We recommend updating your browser to
                <a
                  href="https://www.google.com/chrome/"
                  target="_blank"
                  style={{ margin: 'auto 4px' }}
                >
                  Chrome
                </a>
                for more security, speed and the best experience on Rechat.
              </p>
            ),
            confirmLabel: 'Update Browser',
            cancelLabel: 'No, thanks',
            hideConfirmButton: !downloadLink,
            onConfirm: () => window.open(downloadLink, '_blank')
          })
        )
      }
    }
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

        <Intercom />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    contactsAttributeDefs: state.contacts.attributeDefs,
    data: state.data,
    deals: state.deals.list,
    favoritesListings: selectListings(state.favorites.listings),
    rooms: state.chatroom.rooms,
    user: state.user
  }
}

export default connect(mapStateToProps)(App)
