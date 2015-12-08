// Dashboard/Index.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem } from 'react-bootstrap'
import S from 'shorti'

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
    const data = AppStore.data
    AppStore.data.scroll_area_height = window.innerHeight - 182
    AppStore.emitChange()
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  init(){
    
    const data = this.props.data
    data.scroll_area_height = window.innerHeight - 182
    const user = data.user
    
    AppDispatcher.dispatch({
      action: 'add-user-to-store',
      user: user
    })

    AppDispatcher.dispatch({
      action: 'get-rooms',
      user: user
    })
  }

  getMessages(current_room){
    
    const data = AppStore.data
    
    AppDispatcher.dispatch({
      action: 'get-messages',
      user: data.user,
      room: current_room
    })
  }

  componentWillMount(){
    this.init()
  }

  showModal(modal_key){
    AppDispatcher.dispatch({
      action: 'show-modal',
      modal_key: modal_key
    })
  }

  hideModal(){
    AppStore.data.showCreateChatModal = false
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

  componenentDidUpdate(){
    this.getMessages()
  }

  render(){

    // Data
    let data = this.props.data
    let current_room
    data.rooms = AppStore.data.rooms
    data.showCreateChatModal = AppStore.data.showCreateChatModal

    // Get messages
    if(data.rooms && !data.messages){
      current_room = data.rooms[0]
      if(data.current_room)
        current_room = data.current_room
      this.getMessages(current_room)
    }

    if(this.props.route.path){
      data.path = this.props.route.path
    } else {
      data.path = '/dashboard'
    }

    // Style
    const main_style = S('absolute l-250 r-0')
    const footer_style = S('fixed b-0 l-580 r-0 p-20')

    return (
      <div>
        <header>
          <MainNav showModal={ this.showModal } hideModal={ this.hideModal } createRoom={ this.createRoom } data={ data }/>
        </header>
        <SideBar data={ data }/>
        <main style={ main_style }>
          <MainContent getMessages={ this.getMessages } data={ data }/>
        </main>
        <footer style={ footer_style }>
          <form onSubmit={ this.createMessage.bind(this) }>
            <div className="form-group" style={ S('w-100p') }>
              <input ref="message_input" type="text" className="form-control" style={ S('w-100p pl-50') } placeholder="Type your message and press enter"/>
              <button type="button" className="btn btn-default" style={ S('absolute l-20 t-20') }>
                <i className="fa fa-plus" style={ S('t-2 relative') }></i>
              </button>
            </div>
          </form>
        </footer>
      </div>
    )
  }
}