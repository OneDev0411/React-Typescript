// Dashboard/Index.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'
import config from '../../../../../config/public'

// AppDispatcher
import AppDispatcher from '../../../../dispatcher/AppDispatcher'

// AppStore
import AppStore from '../../../../stores/AppStore'

// Partials
import MainContent from './Partials/MainContent'
import MainNav from '../Partials/MainNav'
import SideBar from '../Partials/SideBar'

// Socket.io
import io from 'socket.io-client'

export default class Dashboard extends Component {

  componentWillMount() {
    this.init()
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)

    // Listen for new messages
    const socket = io(config.socket.server)
    const data = AppStore.data
    socket.emit('Authenticate', data.user.access_token)

    // Listen for new message
    socket.on('Message.Sent', (room, message) => {
      const current_room = AppStore.data.current_room
      // If in this room
      if (current_room.id === room.id) {
        if (data.user.id === message.author.id)
          message.fade_in = true
        AppStore.data.messages.push(message)
        const rooms = AppStore.data.rooms
        const current_room_index = _.findIndex(rooms, { id: current_room.id })
        AppStore.data.rooms[current_room_index].latest_message = message
        AppStore.emitChange()
        if (data.user.id !== message.author.id)
          this.checkNotification(message)
      }
    })
    // Listen for typing
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
    socket.on('Room.OnlineUsers', () => {
      // console.log(response)
      // AppStore.emitChange()
    })
  }

  componentWillUpdate() {
    window.addEventListener('resize', this.handleResize)
  }

  getPreviousMessages(scroll_height) {
    const user = AppStore.data.user
    const current_room = AppStore.data.current_room
    AppDispatcher.dispatch({
      action: 'get-previous-messages',
      user,
      room: current_room,
      scroll_height
    })
  }

  getMessages(current_room) {
    AppStore.data.messages_loading = true
    AppStore.emitChange()

    const data = AppStore.data
    AppDispatcher.dispatch({
      action: 'get-messages',
      user: data.user,
      room: current_room
    })
    // Show room_id in url
    history.pushState(null, null, '/dashboard/recents/' + current_room.id)
  }

  getUserRooms() {
    const data = this.props.data
    const user = data.user
    const room_id = this.props.params.room_id
    AppDispatcher.dispatch({
      action: 'get-rooms',
      user,
      room_id
    })
  }

  createMessage(e) {
    e.preventDefault()
    const comment = this.refs.message_input.value
    const user = this.props.data.user
    const current_room = this.props.data.current_room

    // If no comment
    if (!comment.trim())
      return false

    AppDispatcher.dispatch({
      action: 'create-message',
      user,
      room: current_room,
      comment
    })

    this.refs.message_input.value = ''
  }

  inviteUser(title) {
    return title
    // console.log('invite user',title)
  }

  createRoom(title) {
    const user = AppStore.data.user
    AppDispatcher.dispatch({
      action: 'create-room',
      user,
      title
    })
  }

  showModal(modal_key) {
    AppDispatcher.dispatch({
      action: 'show-modal',
      modal_key
    })
  }

  hideModal() {
    delete AppStore.data.show_create_chat_modal
    delete AppStore.data.show_invite_user_modal
    AppStore.emitChange()
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
      this.refs.notif_sound.play()
    }
  }

  handleMessageTyping() {
    const socket = io(config.socket.server)
    const data = AppStore.data
    if (data.is_typing)
      return false
    AppStore.data.is_typing = data.user
    AppStore.emitChange()
    socket.emit('User.Typing', AppStore.data.current_room.id)
    setTimeout(() => {
      socket.emit('User.TypingEnded', AppStore.data.current_room.id)
    }, 3000)
  }

  addUserToStore() {
    const data = this.props.data
    const user = data.user
    AppDispatcher.dispatch({
      action: 'add-user-to-store',
      user
    })
  }

  handleResize() {
    AppStore.emitChange()
  }

  filterRooms(search_text) {
    const search_text_lower = search_text.toLowerCase().trim()
    const data = AppStore.data
    const rooms = data.rooms
    const filtered_rooms = rooms.filter((room) => {
      const users_first_string = _.pluck(room.users, 'first_name').toString().toLowerCase()
      const users_last_string = _.pluck(room.users, 'last_name').toString().toLowerCase()
      if (users_first_string.indexOf(search_text_lower) !== -1)
        return true

      if (users_last_string.indexOf(search_text_lower) !== -1)
        return true

      if (room.title.toLowerCase().indexOf(search_text_lower) !== -1)
        return true

      return false
    })

    if (!search_text_lower)
      AppStore.data.is_filtering = false
    else
      AppStore.data.is_filtering = true

    AppStore.data.filtered_rooms = filtered_rooms
    AppStore.emitChange()
  }

  init() {
    this.addUserToStore()
    this.getUserRooms()
  }

  render() {
    // Data
    const data = this.props.data
    data.rooms = AppStore.data.rooms
    data.is_filtering = AppStore.data.is_filtering
    data.filtered_rooms = AppStore.data.filtered_rooms
    data.current_room = AppStore.data.current_room
    data.messages = AppStore.data.messages
    data.show_create_chat_modal = AppStore.data.show_create_chat_modal
    data.show_invite_user_modal = AppStore.data.show_invite_user_modal
    return (
      <div style={ S('minw-1000') }>
        <header>
          <MainNav data={ data }/>
        </header>
        <main>
          <SideBar data={ data }/>
          <MainContent
            getPreviousMessages={ this.getPreviousMessages }
            handleMessageTyping={ this.handleMessageTyping }
            filterRooms={ this.filterRooms }
            createMessage={ this.createMessage }
            showModal={ this.showModal }
            hideModal={ this.hideModal }
            createRoom={ this.createRoom }
            inviteUser={ this.inviteUser }
            getMessages={ this.getMessages }
            data={ data }
          />
        </main>
        <audio ref="notif_sound" id="notif-sound">
          <source src="/audio/goat.mp3" type="audio/mpeg" />
        </audio>
      </div>
    )
  }
}

// PropTypes
Dashboard.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object.isRequired
}