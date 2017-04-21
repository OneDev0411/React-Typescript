// App.js
import React, { Component } from 'react'
import _ from 'lodash'
import io from 'socket.io-client'
import AppDispatcher from '../dispatcher/AppDispatcher'
import NotificationDispatcher from '../dispatcher/NotificationDispatcher'
import AppStore from '../stores/AppStore'
import Brand from '../controllers/Brand'
import ReactGA from 'react-ga'
import config from '../../config/public'

export default class App extends Component {
  componentWillMount() {
    if (typeof window !== 'undefined') {
      const reconnect_vars = {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 99999
      }
      window.socket = io(config.socket.server, reconnect_vars)
    }
  }
  // Add change listeners to stores
  componentDidMount() {
    Brand.checkBranding()
    AppStore.addChangeListener(this._onChange.bind(this))
    window.socket.on('reconnecting', () => {
      AppStore.data.socket_reconnecting = true
      AppStore.emitChange()
    })
    window.socket.on('reconnect', () => {
      window.socket.emit('Authenticate', AppStore.data.user.access_token)
      delete AppStore.data.socket_reconnecting
      AppStore.data.socket_reconnected = true
      const data = AppStore.data
      const current_room = data.current_room
      const user = data.user
      let room_id
      if (current_room)
        room_id = data.current_room.id
      AppDispatcher.dispatch({
        action: 'get-rooms',
        user,
        room_id
      })
      AppStore.emitChange()
      // Remove reconnected message after 3 seconds
      setTimeout(() => {
        delete AppStore.data.socket_reconnected
        AppStore.emitChange()
      }, 3000)
    })
    window.socket.on('ping', (cb) => {
      if (cb)
        cb(null, new Date())
    })
    // Check for mobile
    this.checkForMobile()
    // If logged in
    // const data = AppStore.data
    // if (data.user)
    //   this.triggerBranchBanner()
    const MobileDetect = require('mobile-detect')
    const md = new MobileDetect(window.navigator.userAgent)
    if (md.is('iPhone') && !AppStore.data.is_widget)
      this.showMobileSplashViewer()
  }
  componentDidUpdate() {
    const data = AppStore.data
    if (data.user && !data.session_started) {
      this.initSockets()
      AppStore.data.session_started = true
      AppStore.emitChange()
    }
    const brand = Brand.flatten(data.brand)
    if (brand && brand.assets.google_analytics_id && !data.brand_merged) {
      const google_analytics_id = brand.assets.google_analytics_id
      ReactGA.initialize(google_analytics_id)
      ReactGA.set({ page: window.location.pathname })
      ReactGA.pageview(window.location.pathname)
      AppStore.data.brand_merged = true
      AppStore.emitChange()
    }
    this.setIntercom()
    // get notifications once
    if (data.user && !data.getting_notifications && !data.notifications_retrieved) {
      AppStore.data.getting_notifications = true
      AppStore.emitChange()
      NotificationDispatcher.dispatch({
        action: 'get-all',
        user: data.user
      })
    }
  }
  // Remove change listeners from stores
  componentWillUnmount() {
    AppStore.removeChangeListener(this._onChange.bind(this))
  }
  setIntercom() {
    const data = AppStore.data
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
    // this.createBranchLink()
    AppStore.emitChange()
  }
  // createBranchLink() {
  //   const branch = require('branch-sdk')
  //   branch.init(config.branch.key)
  //   let branch_data = window.branchData
  //   if (!branch_data) {
  //     branch_data = {
  //       '$always_deeplink': true
  //     }
  //   }
  //   branch.link({
  //     data: branch_data
  //   }, (err, link) => {
  //     // console.log(err, link)
  //     AppStore.data.branch_link = link
  //     AppStore.emitChange()
  //   })
  // }
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

  checkForMobile() {
    // Check for mobile
    AppDispatcher.dispatch({
      action: 'check-for-mobile'
    })
  }

  getNotifications(notification) {
    const data = AppStore.data
    NotificationDispatcher.dispatch({
      action: 'get-all',
      user: data.user
    })
    // Add notification to count
    if (notification.notification_type === 'UserSentMessage') {
      const room = notification.room
      const room_index = _.findIndex(data.rooms, { id: room })
      AppStore.data.rooms[room_index].new_notifications = AppStore.data.rooms[room_index].new_notifications + 1
      AppStore.emitChange()
    }
  }

  updateRoomsIndexedDB() {
    const data = AppStore.data
    const user = data.user
    AppDispatcher.dispatch({
      action: 'update-rooms-indexeddb',
      user_id: user.id
    })
  }

  initSockets() {
    const socket = window.socket
    const data = AppStore.data
    socket.emit('Authenticate', data.user.access_token)
    socket.on('Message.Sent', (room, message) => {
      const current_room = AppStore.data.current_room
      const rooms = AppStore.data.rooms
      // If in current room
      if (current_room && room && current_room.id === room.id) {
        if (message.author && data.user.id === message.author.id)
          message.fade_in = true
        if (AppStore.data.current_room) {
          if (!AppStore.data.current_room.messages)
            AppStore.data.current_room.messages = []
          AppStore.data.current_room.messages.push(message)
        }
        const current_room_index = _.findIndex(rooms, { id: current_room.id })
        AppStore.data.rooms[current_room_index].latest_message = message
        if (AppStore.data.rooms[current_room_index].messages && !_.find(AppStore.data.rooms[current_room_index].messages, { id: message.id }))
          AppStore.data.rooms[current_room_index].messages.push(message)
        AppStore.data.scroll_bottom = true
        if (message.author && data.user.id !== message.author.id)
          this.checkNotification(message)
      } else {
        // Add to not current room
        const message_room_index = _.findIndex(rooms, { id: room.id })
        // If room not found
        if (!AppStore.data.rooms || !AppStore.data.rooms[message_room_index])
          return
        if (!AppStore.data.rooms[message_room_index].messages)
          AppStore.data.rooms[message_room_index].messages = []
        AppStore.data.rooms[message_room_index].messages.push(message)
        AppStore.data.rooms[message_room_index].latest_message = message
        AppStore.data.rooms = _.sortBy(AppStore.data.rooms, (room_loop) => {
          if (room_loop.latest_message)
            return -room_loop.latest_message.created_at
        })
      }
      AppStore.emitChange()
      this.updateRoomsIndexedDB()
    })
    socket.on('User.Typing', (response) => {
      const author_id = response.user_id
      const room_id = response.room_id
      AppStore.data.is_typing = {
        author_id,
        room_id
      }
      delete AppStore.data.current_room.viewing_previous
      AppStore.emitChange()
    })
    socket.on('User.TypingEnded', () => {
      delete AppStore.data.is_typing
      AppStore.emitChange()
    })
    socket.on('Users.States', (response) => {
      const user_states = response
      const users_online = user_states.filter((user_state) => {
        if (user_state.state === 'Online' || user_state.state === 'Background')
          return true
      })
      const user_ids = _.map(users_online, 'user_id')
      AppStore.data.users_online = user_ids
      AppStore.emitChange()
    })
    socket.on('User.State', (state, user_id) => {
      if (!AppStore.data.users_online)
        AppStore.data.users_online = []
      if (state === 'Online' || state === 'Background')
        AppStore.data.users_online.push(user_id)
      if (state === 'Offline') {
        AppStore.data.users_online = AppStore.data.users_online.filter((id) => {
          if (user_id !== id)
            return true
        })
      }
      AppStore.emitChange()
    })
    socket.on('Room.UserJoined', (user, room) => {
      setTimeout(() => {
        // Add users
        if (AppStore.data.rooms) {
          if (_.find(AppStore.data.rooms, { id: room.id })) {
            const index = _.findIndex(AppStore.data.rooms, { id: room.id })
            AppStore.data.rooms[index].users.push(user)
            AppStore.data.rooms[index].users = _.uniqBy(AppStore.data.rooms[index].users, 'id')
          } else {
            room.users = [user]
            AppStore.data.rooms = [
              room,
              ...AppStore.data.rooms
            ]
          }
        } else {
          room.users = [user]
          AppStore.data.rooms = [room]
        }
        // Get messages
        if (user.id === AppStore.data.user.id) {
          AppDispatcher.dispatch({
            action: 'get-room-and-messages',
            user: AppStore.data.user,
            room
          })
        }
      }, 1000)
    })

    socket.on('Notification.Delivered', (resp) => {
      const { room, object, notification_type } = resp.notification
      const room_index = this.getRoomIndexById(room)
      const messages = AppStore.data.rooms[room_index].messages
      const me = AppStore.data.user.id
      const user = resp.user

      AppStore.data.rooms[room_index].messages = _.map(messages, (message) => {
        if (message.id === object && message.author && message.author.id === me && user !== me) {
          if (!_.find(message.deliveries, { user })) {
            const dlvr = {
              created_at: new Date(),
              delivery_type: resp.delivery_type,
              type: notification_type,
              user
            }

            if (message.deliveries)
              message.deliveries.push(dlvr)
            else
              message.deliveries = [dlvr]
          }
        }

        return message
      })

      AppStore.emitChange()
    })

    // socket.on('Notification.Acknowledged', () => {
    // })

    socket.on('Room.Acknowledged', (ack) => {
      const { type, user, room } = ack

      if (type && type.actions && type.actions.indexOf('Sent') === -1)
        return

      const room_index = this.getRoomIndexById(room)
      const messages = AppStore.data.rooms[room_index].messages
      const me = AppStore.data.user.id

      AppStore.data.rooms[room_index].messages = _.map(messages, (message) => {
        if (message.author && message.author.id === me && user !== me) {
          if (message.acked_by && message.acked_by.indexOf(user) === -1)
            message.acked_by.push(user)
          else
            message.acked_by = [user]
        }
        return message
      })

      AppStore.emitChange()
    })

    socket.on('Notification', this.getNotifications)
  }

  getRoomIndexById(id) {
    const rooms = AppStore.data.rooms
    const current_room = AppStore.data.current_room
    return id === current_room ? current_room : _.findIndex(rooms, { id })
  }

  checkNotification(message) {
    if (!('Notification' in window))
      return false

    if (document && document.hasFocus())
      return false

    const Notification = window.Notification || window.mozNotification || window.webkitNotification

    if (Notification.permission === 'granted')
      this.sendNotification(message)
    else {
      Notification.requestPermission((permission) => {
        if (permission === 'granted')
          this.sendNotification(message)
      })
    }
  }

  sendNotification(message) {
    const profile_image_url = `${config.app.url}/static/images/dashboard/rebot@2x.png`
    let first_name = 'Rebot'
    if (message.author)
      first_name = message.author.first_name

    const title = `New message from ${first_name}`
    let comment = message.comment
    if (!comment)
      comment = 'File uploaded'
    const instance = new Notification(
      title, {
        body: comment,
        icon: profile_image_url,
        sound: '/static/audio/ding.mp3'
      }
    )
    instance.onclick = () => {
      window.focus()
    }
    instance.onshow = () => {
      AppStore.data.play_sound = true
      AppStore.emitChange()
    }
  }

  _onChange() {
    this.setState({
      AppStore
    })
  }

  render() {
    let data = AppStore.data

    const path = this.props.location.pathname
    const location = this.props.location
    data.path = path
    data.location = location
    // Hydrate store if coming from server
    if (typeof window !== 'undefined' && window.AppStore) {
      const server_data = window.AppStore.data
      // merge into client
      data = { ...server_data, ...data }
    }
    const Routes = React.cloneElement(this.props.children, { data })
    return Routes
  }
}

// PropTypes
App.propTypes = {
  children: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}
