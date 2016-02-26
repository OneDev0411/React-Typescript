// App.js
// Build stlye sheet
if (process.env.WEBPACK_PROCESS === 'build')
  // Style
  require('../src/sass/main.scss')

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

  // Add change listeners to stores
  componentDidMount() {
    AppStore.addChangeListener(this._onChange.bind(this))
    window.socket = io(config.socket.server)
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
      if (current_room.id === room.id) {
        if (message.author && data.user.id === message.author.id)
          message.fade_in = true
        AppStore.data.messages.push(message)
        const rooms = AppStore.data.rooms
        const current_room_index = _.findIndex(rooms, { id: current_room.id })
        AppStore.data.rooms[current_room_index].latest_message = message
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
    const instance = new Notification(
      title, {
        body: message.comment,
        icon: profile_image_url,
        sound: '/audio/goat.mp3'
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
      data = { ...data, ...server_data }
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