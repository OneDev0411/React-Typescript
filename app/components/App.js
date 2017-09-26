import React, { Component } from 'react'
import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import AppDispatcher from '../dispatcher/AppDispatcher'
import Load from '../loader'

import getBrand from '../store_actions/brand'

// services
import ChatSocket from './Pages/Dashboard/Chatroom/Services/socket'
import DealSocket from './Pages/Dashboard/Deals/services/socket'

// navs
import SideBar from './Pages/Dashboard/Partials/SideBar'

const MobileNav = Load({
  loader: () => import('./Pages/Dashboard/Partials/MobileNav')
})

// global chat components
import { getRooms } from '../store_actions/chatroom'

// deals featch on launch
import { getDeals } from '../store_actions/deals'

const InstantChat = Load({
  loader: () => import('./Pages/Dashboard/Chatroom/InstantChat')
})

// contacts
import { getContacts } from '../store_actions/contact'

// import _ from 'lodash'
import NotificationDispatcher from '../dispatcher/NotificationDispatcher'
import AppStore from '../stores/AppStore'
import Brand from '../controllers/Brand'
import ReactGA from 'react-ga'
import config from '../../config/public'

class App extends Component {
  componentWillMount() {
    const { user } = this.props

    // check branding
    this._getBrand()

    if (user && typeof window !== 'undefined') {
      this.initializeChatSocket(user)
      this.initializeDealSocket(user)
    }
  }

  componentDidMount() {
    const { data, user } = this.props

    if (user) {
      // load rooms
      this.initialRooms()

      // load deals
      this.initialDeals(user)

      // load contacts
      this.initialContacts()

      // load notifications
      this.loadNotifications(data)
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
    return dispatch(getRooms(user))
  }

  _getBrand() {
    this.props.dispatch(getBrand())
  }

  initializeChatSocket(user) {
    new ChatSocket(user)
  }

  initializeDealSocket(user) {
    new DealSocket(user)
  }

  async initialDeals(user) {
    const { dispatch, deals } = this.props

    if (!deals) {
      const isBackOffice =
        user.brand && user.features && user.features.includes('Backoffice')
      return dispatch(getDeals(user, isBackOffice))
    }
  }

  async initialRooms() {
    let { rooms, dispatch } = this.props

    if (!rooms) {
      rooms = await dispatch(getRooms())
    }

    // hack for share alert modal -> prepare rooms for it
    AppStore.data.rooms = rooms
  }

  initialContacts() {
    const { dispatch, contacts } = this.props

    if (!contacts) {
      dispatch(getContacts())
    }
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

    ReactGA.initialize(google_analytics_id, {
      debug: true
    })
    ReactGA.ga(
      'create',
      google_analytics_id,
      'auto',
      brand && brand.hostnames ? brand.hostnames[0] : 'rechat'
    )
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
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
    const { data, user, rooms, location, isWidgetRedux } = this.props

    // don't remove below codes,
    // because app is depended to `path` and `location` props in data store
    const path = location.pathname
    data.path = path
    data.location = location

    const children = React.cloneElement(this.props.children, {
      data,
      user
    })

    // render sidebar
    let navArea = <SideBar data={data} location={location} />

    if (data.is_mobile && user) {
      // nav_area = <MobileNav data={data} />
      navArea = <div />
    }

    return (
      <div>
        {user && !isWidgetRedux && navArea}

        {user && <InstantChat user={user} rooms={rooms} />}

        <main className={`l-app__main ${user ? 'is-logged-in' : ''}`}>
          {children}
        </main>
      </div>
    )
  }
}

export default connect(({ user, data, deals, contact, chatroom, widgets }) => ({
  data,
  user,
  deals: deals.list,
  rooms: chatroom.rooms,
  contacts: contact.list,
  isWidgetRedux: widgets.isWidget
}))(App)
