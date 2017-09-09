import React, { Component } from 'react'
import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import AppDispatcher from '../dispatcher/AppDispatcher'
import Load from '../loader'

// services
import ChatSocket from './Pages/Dashboard/Chatroom/Services/socket'

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
  static async fetchData(dispatch, params) {
    const { user } = params
    return dispatch(getRooms(user))
  }

  componentWillMount() {
    if (typeof window !== 'undefined') {
      this.initializeChatSocket()
    }
  }

  componentDidMount() {
    const { data } = this.props
    const { user } = data

    // check branding
    Brand.checkBranding()

    // load rooms
    this.initialRooms()

    // load deals
    this.initialDeals()

    // load contacts
    this.initialContacts()

    // check user is mobile device or not
    this.checkForMobile()

    // load notifications
    this.loadNotifications(data)

    // branch banner
    this.triggerBranchBanner(user)

    // google analytics
    this.initialGoogleAnalytics(data)

    // Set intercom
    this.setIntercom()
  }

  initializeChatSocket() {
    const { user } = this.props.data
    new ChatSocket(user)
  }

  async initialDeals() {
    const { dispatch, data } = this.props
    const { user } = data

    const isBackOffice = user.features.indexOf('Backoffice') > -1
    return dispatch(getDeals(user, isBackOffice))
  }

  async initialRooms() {
    const { dispatch, data } = this.props
    let { rooms } = this.props

    if (data.user && !rooms) {
      rooms = await dispatch(getRooms())
    }

    // hack for share alert modal -> prepare rooms for it
    AppStore.data.rooms = rooms
  }

  initialContacts() {
    const { dispatch, contacts, data } = this.props

    if (data.user && !contacts) {
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

  setIntercom() {
    const { data } = this.props
    if (!data.intercom_set && data.user) {
      window.intercomSettings = {
        app_id: 'pkzkvg9a',
        name: `${data.user.first_name} ${data.user.last_name}`, // Full name
        email: `${data.user.email}` // Email address
      }
      AppStore.data.intercom_set = true
      AppStore.emitChange()
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
    const { data, rooms, location, isWidgetRedux } = this.props
    const { user } = data

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
    let navArea = <SideBar data={data} />

    if (data.is_mobile && user) {
      // nav_area = <MobileNav data={data} />
      navArea = <div />
    }

    return (
      <div>
        {
          user && !isWidgetRedux &&
          navArea
        }

        {
          user &&
          <InstantChat user={user} rooms={rooms} />
        }

        <main style={{ minHeight: '100vh' }}>
          {children}
        </main>
      </div>
    )
  }
}

export default connect(s => ({
  data: s.data,
  rooms: s.chatroom.rooms,
  contacts: s.chatroom.contact,
  isWidgetRedux: s.widgets.isWidget
}))(App)
