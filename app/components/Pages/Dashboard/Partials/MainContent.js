// MainContent.js
import React, { Component } from 'react'
import { Nav, NavItem, NavDropdown, MenuItem, ButtonToolbar, Dropdown, Modal, Button, Input } from 'react-bootstrap'
import S from 'shorti'
import RoomsList from './RoomsList'
import MessagesList from './MessagesList'

export default class MainContent extends Component {

  handleKeyUp(){
    const search_text = this.refs.search_text.value
    this.props.filterRooms(search_text)
  }

  showModal(modal_key) {
    this.props.showModal(modal_key)
    setTimeout(() => {
      if(modal_key === 'create-chat' && this.refs.title)
        this.refs.title.getInputDOMNode().focus()
      if(modal_key === 'invite-user' && this.refs.email)
        this.refs.email.getInputDOMNode().focus()
    }, 300)
  }

  createRoom(e){
    e.preventDefault()
    let title = this.refs.title.getInputDOMNode().value
    title = title.trim()
    if(title)
      this.props.createRoom(title)
  }

  inviteUser(e){
    e.preventDefault()
    let email = this.refs.email.getInputDOMNode().value
    email = email.trim()
    if(email)
      this.props.inviteUser(email)
  }

  hideModal(e){
    this.props.hideModal()
  }

  render(){

    // Data
    let data = this.props.data
    const path = data.path

    // Styles
    const main_style = S('absolute l-222 r-0')
    
    // Rooms
    const rooms_column_style = {
      overflow: 'scroll',
      height: window.innerHeight - 58,
      borderRight: '1px solid #e7e4e3',
      width: '320px'
    }

    // Messages
    const messages_column_style = {
      ...S('absolute pt-15 l-320 minw-450'),
      height: window.innerHeight - 58,
      width: window.innerWidth - 542
    }

    const footer_style = S('absolute w-100p l-0 b-0 r-0 p-20 pb-10')

    // Dashboard default
    let main_content = (
      <div style={ main_style }>
        <div style={ S('ml-20') }>
          <h1>Hello and Welcome</h1>
          <p>This is your dashboard, enjoy doing lots of fun things here...</p>
        </div>    
      </div>
    )

    let is_typing
    if(data.is_typing && data.is_typing.id != data.user.id){
      is_typing = (
        <div style={ S('absolute l-20 t-0 font-12') }>
          { data.is_typing.first_name } is typing
        </div>
      )
    }

    // Create message form
    let footer_form = (
      <div style={ footer_style }>
        { is_typing }
        <form onSubmit={ this.props.createMessage.bind(this) }>
          <div className="form-group" style={ S('w-100p') }>
            <input onKeyDown={ this.props.handleMessageTyping.bind(this) } ref="message_input" type="text" className="form-control" style={ S('w-100p pl-70 bw-2') } placeholder="Type your message and press enter"/>
            <button type="button" className="btn btn-default create-message__btn" style={ S('absolute bw-2 p-0 w-56 h-38 l-20 t-20') }>
              <span className="plus" style={ S('font-22 relative t-1n color-ccc') }>+</span>
            </button>
          </div>
        </form>
      </div>
    )
    if(!data.current_room){
      footer_form = ''
    }
    
    if(path === '/dashboard/recents' || path === '/dashboard/recents/:room_id'){

      main_content = (
        <div style={ main_style }>
          <div className="dashboard__chat-rooms pull-left" style={ rooms_column_style }>
            <div style={ S('p-10 pt-15 h-60 relative') }>
              <input ref="search_text" onKeyUp={ this.handleKeyUp.bind(this) } style={ S('w-85p br-10') } type="text" placeholder="Search chats" className="form-control pull-left" />
              <button onClick={ this.showModal.bind(this,'create-chat') } type="button" className="btn btn-primary" style={ S('w-40 h-40 ml-6 pointer absolute p-0 t-15 r-8 br-100') } >
                <img src="/images/svgs/create-chat.svg"/>
              </button>
              <div className="clearfix"></div>
            </div>
            <RoomsList getMessages={ this.props.getMessages } data={ data }/>
          </div>
          <div className="dashboard__messages pull-left" style={ messages_column_style }>
            <MessagesList showModal={ this.showModal.bind(this) } data={ data }/>
            { footer_form }
          </div>
          <Modal show={ data.showCreateChatModal } onHide={ this.hideModal.bind(this) }>
            <form onSubmit={ this.createRoom.bind(this) }>
              <Modal.Header closeButton>
                <Modal.Title>Start a new chat</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Input type="text" ref="title" placeholder="Chat room title"/>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={ this.hideModal.bind(this) }>Cancel</Button>
                <Button type="submit" bsStyle="primary">Start chat</Button>
              </Modal.Footer>
            </form>
          </Modal>
          <Modal show={ data.showInviteUserModal } onHide={ this.hideModal.bind(this) }>
            <form onSubmit={ this.inviteUser.bind(this) }>
              <Modal.Header closeButton>
                <Modal.Title>Invite User</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Input type="text" ref="email" placeholder="User email address"/>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={ this.hideModal.bind(this) }>Cancel</Button>
                <Button type="submit" bsStyle="primary">Invite User</Button>
              </Modal.Footer>
            </form>
          </Modal>
        </div>
      )
    }

    if(path === '/dashboard/mls'){
      main_content = (
        <div style={ main_style }>
          <div style={ S('ml-20') }>
            <h1>MLS</h1>
            <p>This is mls stuff</p>
          </div>    
        </div>
      )
    }

    if(path === '/dashboard/contacts'){
      main_content = (
        <div style={ main_style }>
          <div style={ S('ml-20') }>
            <h1>Contacts</h1>
            <p>This is Contacts stuff</p>
          </div>
        </div>
      )
    }

    if(path === '/dashboard/tasks'){
      main_content = (
        <div style={ main_style }>
          <div style={ S('ml-20') }>
            <h1>Tasks</h1>
            <p>This is tasks stuff</p>
          </div>
        </div>
      )
    }

    if(path === '/dashboard/transactions'){
      main_content = (
        <div style={ main_style }>
          <div style={ S('ml-20') }>
            <h1>Transactions</h1>
            <p>This is transactions stuff</p>
          </div>
        </div>
      )
    }
    return main_content;
  }
}