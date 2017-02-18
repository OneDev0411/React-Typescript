// App.js
import React, { Component } from 'react'
import _ from 'lodash'
import config from '../../config/public'

// Socket.io
import io from 'socket.io-client'

// AppDispatcher
import AppDispatcher from '../dispatcher/AppDispatcher'

// Store
import AppStore from '../stores/AppStore'

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
    AppStore.addChangeListener(this._onChange.bind(this))
    window.socket.on('reconnecting', () => {
      AppStore.data.socket_reconnecting = true
      AppStore.emitChange()
    })
    window.socket.on('reconnect', () => {
      window.socket.emit('Authenticate', AppStore.data.user.access_token)
      delete AppStore.data.socket_reconnecting
      AppStore.data.socket_reconnected = true
      AppStore.emitChange()
      // Remove reconnected message after 3 seconds
      setTimeout(() => {
        delete AppStore.data.socket_reconnected
        AppStore.emitChange()
      }, 3000)
    })
    window.socket.on('ping', (cb) => {
      if (cb)
        cb(null, new Date)
    })
    // Check for mobile
    this.checkForMobile()
  }

  componentDidUpdate() {
    const data = AppStore.data
    if (data.user && !data.session_started) {
      this.initSockets()
      this.getNotifications()
      AppStore.data.session_started = true
      AppStore.emitChange()
    }
  }

  // Remove change listeners from stores
  componentWillUnmount() {
    AppStore.removeChangeListener(this._onChange.bind(this))
  }

  checkForMobile() {
    // Check for mobile
    AppDispatcher.dispatch({
      action: 'check-for-mobile'
    })
  }

  getNotifications() {
    const data = AppStore.data
    AppDispatcher.dispatch({
      action: 'get-notification-summary',
      user: data.user
    })
  }

  initSockets() {
    const socket = window.socket
    const data = AppStore.data
    socket.emit('Authenticate', data.user.access_token)
    socket.on('Message.Sent', (room, message) => {
      const current_room = AppStore.data.current_room
      if (current_room && room && current_room.id === room.id) {
        if (message.author && data.user.id === message.author.id)
          message.fade_in = true
        if (AppStore.data.messages)
          AppStore.data.messages.push(message)
        const rooms = AppStore.data.rooms
        const current_room_index = _.findIndex(rooms, { id: current_room.id })
        AppStore.data.rooms[current_room_index].latest_message = message
        if (AppStore.data.rooms[current_room_index].messages && !_.find(AppStore.data.rooms[current_room_index].messages, { id: message.id }))
          AppStore.data.rooms[current_room_index].messages.push(message)
        AppStore.data.scroll_bottom = true
        AppStore.emitChange()
        if (message.author && data.user.id !== message.author.id)
          this.checkNotification(message)
      }
    })
    socket.on('User.Typing', response => {
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
    socket.on('Users.Online', response => {
      AppStore.data.users_online = response
      AppStore.emitChange()
    })
    socket.on('User.Online', response => {
      if (!AppStore.data.users_online)
        AppStore.data.users_online = []
      AppStore.data.users_online.push(response)
      AppStore.emitChange()
    })
    socket.on('User.Offline', response => {
      if (!AppStore.data.users_online)
        AppStore.data.users_online = []
      const users_online_edited = AppStore.data.users_online.filter(user_id => {
        return user_id !== response
      })
      AppStore.data.users_online = users_online_edited
      AppStore.emitChange()
    })
    socket.on('Notification', this.getNotifications)
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
      Notification.requestPermission(permission => {
        if (permission === 'granted')
          this.sendNotification(message)
      })
    }
  }

  sendNotification(message) {
    const profile_image_url = config.app.url + '/images/dashboard/rebot@2x.png'
    let first_name = 'Rebot'
    if (message.author)
      first_name = message.author.first_name

    const title = 'New message from ' + first_name
    let comment = message.comment
    if (!comment)
      comment = 'File uploaded'
    const instance = new Notification(
      title, {
        body: comment,
        icon: profile_image_url,
        sound: '/audio/ding.mp3'
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
    this.setState(AppStore)
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
