// Dashboard/Index.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'
import config from '../../../../config/public'

// AppDispatcher
import AppDispatcher from '../../../dispatcher/AppDispatcher'

// AppStore
import AppStore from '../../../stores/AppStore'

// Partials
import MainContent from './Partials/MainContent'
import MainNav from './Partials/MainNav'
import SideBar from './Partials/SideBar'

// Socket.io
import io from 'socket.io-client'

export default class Dashboard extends Component {

  filterRooms(search_text){
    search_text = search_text.toLowerCase().trim()
    const data = AppStore.data
    const rooms = data.rooms
    const filtered_rooms = rooms.filter((room) => {
      let users_first_string = _.pluck(room.users, 'first_name').toString().toLowerCase()
      let users_last_string = _.pluck(room.users, 'last_name').toString().toLowerCase()
      if(users_first_string.indexOf(search_text)!==-1)
        return true
      if(users_last_string.indexOf(search_text)!==-1)
        return true
      if(room.title.toLowerCase().indexOf(search_text)!==-1)
        return true
      return false
    })

    if(!search_text){
      AppStore.data.is_filtering = false
    } else {
      AppStore.data.is_filtering = true
    }
    AppStore.data.filtered_rooms = filtered_rooms
    AppStore.emitChange()
  }

  handleResize(){
    AppStore.emitChange()
  }

  componentWillUpdate(){
    this.handleResize
    window.addEventListener('resize', this.handleResize);
  }

  componentDidMount() {
    this.handleResize
    window.addEventListener('resize', this.handleResize);
  }

  addUserToStore(){
    const data = this.props.data
    const user = data.user
    AppDispatcher.dispatch({
      action: 'add-user-to-store',
      user: user
    })
  }

  getUserRooms(){
    const data = this.props.data
    const user = data.user
    const room_id = this.props.params.room_id
    AppDispatcher.dispatch({
      action: 'get-user-rooms',
      user: user,
      room_id: room_id
    })
  }

  init(){
    let data = this.props.data
    this.addUserToStore()
    this.getUserRooms()
  }

  getMessages(current_room){
    
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

  handleMessageTyping(){
    const socket = io(config.socket.server)
    const data = AppStore.data
    if(data.is_typing)
      return false
    AppStore.data.is_typing = data.user
    AppStore.emitChange()
    socket.emit('typing', AppStore.data.current_room.id)
    setTimeout(() => {
      socket.emit('typing ended', AppStore.data.current_room.id)
    }, 3000)
  }

  componentWillMount(){
    this.init()
  }

  sendNotification(message){
    
    if(document && document.hasFocus())
      return false
    
    const Notification = window.Notification || window.mozNotification || window.webkitNotification
    Notification.requestPermission()
    let profile_image_url = config.app.url + '/images/dashboard/rebot.png'
    let first_name = 'Rebot'
    if(message.author){
      first_name = message.author.first_name
    }

    let title = 'New message from ' + first_name
    const instance = new Notification(
      title, {
        body: message.comment,
        icon: profile_image_url
      }
    )

    // Event Callbacks
    // instance.onclick = function () {
    //   // Something to do
    // };
    // instance.onerror = function () {
    //   // Something to do
    // };
    // instance.onshow = function () {
    //   // Something to do
    // };
    // instance.onclose = function () {
    //   // Something to do
    // };
  }

  componentDidMount(){
    // Listen for new messages
    const socket = io(config.socket.server)
    const data = AppStore.data
    socket.emit('authenticate', data.user.access_token)
    // Listen for new message
    socket.on('new message',(response) => {
      const message = response.message
      const room = response.room
      const messages = AppStore.data.messages
      const current_room = AppStore.data.current_room
      // If in this room
      if(current_room.id == room.id){
        if(data.user.id === message.author.id)
          message.fade_in = true
        AppStore.data.messages.push(message)
        const rooms = AppStore.data.rooms
        let current_room_index = _.findIndex(rooms, { id: current_room.id })
        AppStore.data.rooms[current_room_index].latest_message = message
        AppStore.emitChange()
        if(data.user.id !== message.author.id)
          this.sendNotification(message)
      }
    })
    // Listen for typing
    socket.on('typing',(response) => {
      const author_id = response.user_id
      const room_id = response.room_id
      AppStore.data.is_typing = {
        author_id: author_id,
        room_id: room_id
      }
      AppStore.emitChange()
    })
    socket.on('typing ended',(response) => {
      delete AppStore.data.is_typing
      AppStore.emitChange()
    })
  }

  showModal(modal_key){
    AppDispatcher.dispatch({
      action: 'show-modal',
      modal_key: modal_key
    })
  }

  hideModal(){
    AppStore.data.showCreateChatModal = false
    AppStore.data.showInviteUserModal = false
    AppStore.emitChange()
  }

  createRoom(title){
    const user = AppStore.data.user
    AppDispatcher.dispatch({
      action: 'create-room',
      user: user,
      title: title
    }) 
  }

  inviteUser(title){
    console.log('invite user',title)
  }

  createMessage(e){
    e.preventDefault()
    const comment = this.refs.message_input.value
    const user = this.props.data.user
    const current_room = this.props.data.current_room

    // If no comment
    if(!comment.trim())
      return false

    AppDispatcher.dispatch({
      action: 'create-message',
      user: user,
      room: current_room,
      comment: comment
    }) 

    this.refs.message_input.value = ''

  }

  render(){

    // Data
    let data = this.props.data
    data.rooms = AppStore.data.rooms
    data.is_filtering = AppStore.data.is_filtering
    data.filtered_rooms = AppStore.data.filtered_rooms
    data.current_room = AppStore.data.current_room
    data.messages = AppStore.data.messages
    data.showCreateChatModal = AppStore.data.showCreateChatModal
    data.showInviteUserModal = AppStore.data.showInviteUserModal

    if(this.props.route.path){
      data.path = this.props.route.path
    } else {
      data.path = '/dashboard'
    }

    return (
      <div style={ S('minw-1000') }>
        <header>
          <MainNav data={ data }/>
        </header>
        <main>
          <SideBar data={ data }/>
          <MainContent
            handleMessageTyping={ this.handleMessageTyping } 
            filterRooms={ this.filterRooms } 
            createMessage={ this.createMessage } 
            showModal={ this.showModal } 
            hideModal={ this.hideModal } 
            createRoom={ this.createRoom } 
            inviteUser={ this.inviteUser } 
            getMessages={ this.getMessages } 
            data={ data }/>
        </main>
      </div>
    )
  }
}

// PropTypes
Dashboard.proptypes = {
  data: React.PropTypes.object.isRequired
}