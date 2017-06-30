import React, { Component } from 'react'
import { connect } from 'react-redux'
import S from 'shorti'
import AppDispatcher from '../dispatcher/AppDispatcher'

// services
import ChatSocket from './Pages/Dashboard/Chatroom/Services/socket'

// navs
import SideBar from './Pages/Dashboard/Partials/SideBar'
import MobileNav from './Pages/Dashboard/Partials/MobileNav'

// global chat components
import { getRooms } from '../store_actions/chatroom'
import InstantChat from './Pages/Dashboard/Chatroom/InstantChat'

// contacts
import { getContacts } from '../store_actions/contact'

// import _ from 'lodash'
// import NotificationDispatcher from '../dispatcher/NotificationDispatcher'
import AppStore from '../stores/AppStore'
import Brand from '../controllers/Brand'
import ReactGA from 'react-ga'
import config from '../../config/public'
import MobileDetect from 'mobile-detect'

class App extends Component {

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

    // load contacts
    this.initialContacts(user)

    // check user is mobile device or not
    this.checkForMobile()

    // set intercom
    this.setIntercom()

    if (user)
      this.triggerBranchBanner()

    if (typeof window !== 'undefined') {
      let md = new MobileDetect(window.navigator.userAgent)

      if (md.is('iPhone') && !data.is_widget)
        this.showMobileSplashViewer()
    }
  }

  initializeChatSocket() {
    const { user } = this.props.data
    new ChatSocket(user)
  }

  async initialRooms() {
    const { dispatch, data, rooms } = this.props

    if (data.user && !rooms) {
      const rooms = await dispatch(getRooms())

      // hack for share alert modal -> prepare rooms for it
      AppStore.data.rooms = response.body.data
    }
  }

  initialContacts(user) {
    const { dispatch, contacts } = this.props

    if (user && !contacts) {
      dispatch(getContacts())
    }
  }

  checkForMobile() {
    AppDispatcher.dispatch({
      action: 'check-for-mobile'
    })
  }

  // componentDidUpdate() {
  //   const data = AppStore.data
  //   if (data.user && !data.session_started) {
  //     this.initSockets()
  //     AppStore.data.session_started = true
  //     AppStore.emitChange()
  //   }
  //   const brand = Brand.flatten(data.brand)
  //   if (brand && brand.assets.google_analytics_id && !data.brand_merged) {
  //     const google_analytics_id = brand.assets.google_analytics_id
  //     ReactGA.initialize(google_analytics_id)
  //     ReactGA.set({ page: window.location.pathname })
  //     ReactGA.pageview(window.location.pathname)
  //     AppStore.data.brand_merged = true
  //     AppStore.emitChange()
  //   }
  //   this.setIntercom()
  //   // get notifications once
  //   if (data.user && !data.getting_notifications && !data.notifications_retrieved) {
  //     AppStore.data.getting_notifications = true
  //     AppStore.emitChange()
  //     NotificationDispatcher.dispatch({
  //       action: 'get-all',
  //       user: data.user
  //     })
  //   }
  // }

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
        '$always_deeplink': true
      }
    }

    branch.link({
      data: branch_data
    }, (err, link) => {
      AppStore.data.branch_link = link
      AppStore.emitChange()
    })
  }

  triggerBranchBanner() {
    const branch = require('branch-sdk')
    branch.init(config.branch.key)
    branch.banner({
      icon: '/static/images/logo-big.png',
      title: 'Download the Rechat iOS app',
      description: 'For a better mobile experience',
      showDesktop: false,
      showAndroid: false,
      forgetHide: false,
      downloadAppButtonText: 'GET',
      openAppButtonText: 'OPEN',
      customCSS: '#branch-banner .button { color:  #3388ff; border-color: #3388ff; }'
    }, {
      data: {
        type: (AppStore.data.user ? 'WebBranchBannerClickedUser' : 'WebBranchBannerClickedShadowUser'),
        access_token: (AppStore.data.user ? AppStore.data.user.access_token : null)
      }
    })
  }

  render() {
    const { data, rooms, location } = this.props
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
    const main_style = { minHeight: '100vh' }
    let nav_area = <SideBar data={data} />

    if (data.is_mobile && user) {
      nav_area = <MobileNav data={data} />
    }

    return (
      <div>
        {
          user && !data.is_widget &&
          nav_area
        }

        {
          user &&
          <InstantChat
            user={user}
            rooms={rooms}
          />
        }

        <main style={main_style}>
          { children }
        </main>
      </div>
    )
  }
}

export default connect(s => ({
  data: s.data,
  rooms: s.chatroom.rooms,
  contacts: s.chatroom.contact
}))(App)
