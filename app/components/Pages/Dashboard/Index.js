// Dashboard/Index.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Nav, NavItem } from 'react-bootstrap'
import S from 'shorti'
import _ from 'lodash'

// AppDispatcher
import AppDispatcher from '../../../dispatcher/AppDispatcher'

// AppStore
import AppStore from '../../../stores/AppStore'

// Partials
import MainContent from './Partials/MainContent'
import MainNav from './Partials/MainNav'
import SideBar from './Partials/SideBar'

export default class Dashboard extends Component {

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

  componentWillMount(){
    this.init()
  }

  componentDidMount(){
    let socket = io()
    socket.on('chat message', function(message){
      // Add message if
      const messages = AppStore.data.messages
      const current_room = AppStore.data.current_room
      // does not exist already
      if(_.findWhere(messages, { id: message.id }))
        return false
      // in this room
      if(message.room_id == current_room.id){
        AppStore.data.messages.push(message)
        AppStore.emitChange()
      }
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