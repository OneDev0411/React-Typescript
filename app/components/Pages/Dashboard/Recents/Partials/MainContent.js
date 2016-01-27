// MainContent.js
import React, { Component } from 'react'
import { Modal, Button, Input } from 'react-bootstrap'
import S from 'shorti'
import RoomsList from './RoomsList'
import MessagesList from './MessagesList'
import _ from 'lodash'

export default class MainContent extends Component {

  handleKeyUp() {
    const search_text = this.refs.search_text.value
    this.props.filterRooms(search_text)
  }

  showModal(modal_key) {
    this.props.showModal(modal_key)
    setTimeout(() => {
      if (modal_key === 'create-chat' && this.refs.title)
        this.refs.title.getInputDOMNode().focus()

      if (modal_key === 'invite-user' && this.refs.email)
        this.refs.email.getInputDOMNode().focus()
    }, 300)
  }

  createRoom(e) {
    e.preventDefault()
    let title = this.refs.title.getInputDOMNode().value
    title = title.trim()
    if (title)
      this.props.createRoom(title)
  }

  hideModal() {
    this.props.hideModal()
  }

  render() {
    // Data
    const data = this.props.data

    // Style
    const main_style = S('absolute l-183 r-0')

    // Rooms
    const rooms_column_style = {
      overflow: 'scroll',
      height: window.innerHeight,
      borderRight: '1px solid #e7e4e3',
      width: '320px'
    }

    // Messages
    const messages_column_style = {
      ...S('absolute pt-15 l-320 minw-450'),
      height: window.innerHeight,
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
    if (data.is_typing && data.is_typing.author_id !== data.user.id && data.is_typing.room_id === data.current_room.id) {
      // Get user name
      const author_typing = _.findWhere(data.current_room.users, { id: data.is_typing.author_id })
      if (author_typing) {
        is_typing = (
          <div style={ S('absolute l-20 t-0 font-12') }>
            { author_typing.first_name } is typing...
          </div>
        )
      }
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
    if (!data.current_room)
      footer_form = ''

    main_content = (
      <div style={ main_style }>
        <div className="dashboard__chat-rooms pull-left" style={ rooms_column_style }>
          <div style={ S('p-10 pt-15 h-60 relative') }>
            <input ref="search_text" onKeyUp={ this.handleKeyUp.bind(this) } style={ S('w-85p br-10') } type="text" placeholder="Search chats" className="form-control pull-left" />
            <button onClick={ this.showModal.bind(this, 'create-chat') } type="button" className="btn btn-primary" style={ S('w-40 h-40 ml-6 pointer absolute p-0 t-15 r-8 br-100') }>
              <img src="/images/dashboard/icons/create-chat.svg"/>
            </button>
            <div className="clearfix"></div>
          </div>
          <RoomsList getMessages={ this.props.getMessages } data={ data }/>
        </div>
        <div className="dashboard__messages pull-left" style={ messages_column_style }>
          <MessagesList
            data={ data }
            getPreviousMessages={ this.props.getPreviousMessages }
            showModal={ this.showModal.bind(this) }
            addContactsToRoom={ this.props.addContactsToRoom }
            hideModal={ this.hideModal.bind(this) }
          />
          { footer_form }
        </div>
        <Modal show={ data.show_create_chat_modal } onHide={ this.hideModal.bind(this) }>
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
      </div>
    )

    return main_content;
  }
}

// PropTypes
MainContent.propTypes = {
  data: React.PropTypes.object,
  filterRooms: React.PropTypes.func.isRequired,
  showModal: React.PropTypes.func.isRequired,
  hideModal: React.PropTypes.func.isRequired,
  createRoom: React.PropTypes.func.isRequired,
  createMessage: React.PropTypes.func.isRequired,
  handleMessageTyping: React.PropTypes.func.isRequired,
  getMessages: React.PropTypes.func.isRequired,
  getPreviousMessages: React.PropTypes.func.isRequired,
  addContactsToRoom: React.PropTypes.func.isRequired
}