// CreateMessageArea.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'
import Dropzone from 'react-dropzone'
import ProfileImage from '../../Partials/ProfileImage'
export default class CreateMessageArea extends Component {
  handleMessageKeyDown(e) {
    const data = this.props.data
    const active_contact = data.active_contact
    if (e.which === 9) { // tab
      e.preventDefault()
    } else
      this.props.handleMessageTyping()
  }
  handleMessageKeyUp(e) {
    const message_input = this.messageInput.value
    const data = this.props.data
    const active_contact = data.active_contact
    // Check for @
    if (message_input.indexOf('@') !== -1) {
      if (e.which === 38) // up
        return this.props.handleContactFilterNav('up')
      if (e.which === 40) // down
        return this.props.handleContactFilterNav('down')
      if (e.which === 13) { // enter
        e.preventDefault()
        this.createMessage(e)
        return ''
      }
      this.props.handleContactFilter(message_input, 'show')
    } else
      this.props.handleContactFilter(message_input, 'hide')
  }
  addContactToMessage(contact) {
    this.props.addContactToMessage()
    const message_input = this.messageInput.value
    const message_arr = message_input.split('@')
    this.messageInput.value = `${message_arr[0] + contact.first_name} ${contact.last_name} `
    this.messageInput.focus()
  }
  handleSubmit(e) {
    e.preventDefault()
    this.createMessage()
  }
  createMessage() {
    const data = this.props.data
    const comment = this.messageInput.value
    // If no comment
    if (!comment.trim())
      return false
    if (data.active_contact === undefined || data.active_contact === -1) {
      this.props.createMessage(comment)
      this.messageInput.value = ''
    }
  }
  handleBlur() {
    // Send message on mobile
    const data = this.props.data
    if (data.is_mobile)
      this.createMessage()
  }
  render() {
    // Data
    const data = this.props.data
    let footer_style = S('absolute w-100p l-0 b-0 r-0 p-20 pb-10')
    // Mobile footer
    if (data.is_mobile) {
      footer_style = {
        ...footer_style,
        ...S('b-55 z-3 bg-fff')
      }
    }
    const btn_style = {
      ...S('absolute bw-2 p-0 w-56 h-34 l-22 t-22 z-4'),
      borderTop: 'none',
      borderLeft: 'none',
      borderBottom: 'none',
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0
    }
    let is_typing
    if (data.current_room && data.is_typing && data.is_typing.author_id !== data.user.id && data.is_typing.room_id === data.current_room.id) {
      // Get user name
      const author_typing = _.find(data.current_room.users, { id: data.is_typing.author_id })
      if (author_typing) {
        is_typing = (
          <div style={S('absolute l-20 t-0 font-12')}>
            { author_typing.first_name } is typing...
          </div>
        )
      }
    }
    // Reconnect message
    let is_reconnecting
    if (data.socket_reconnecting) {
      is_reconnecting = (
        <div style={S('absolute l-20 t-0 font-12')}>
          Lost connection.  Reconnecting...
        </div>
      )
    }
    if (data.socket_reconnected) {
      is_reconnecting = (
        <div style={S('absolute l-20 t-0 font-12')}>
          Reconnected!
        </div>
      )
    }

    return (
      <div style={footer_style}>
        <div>
          { is_reconnecting } { is_typing }
        </div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-group" style={S('w-100p')}>
            <input
              onBlur={this.handleBlur.bind(this)}
              onKeyUp={this.handleMessageKeyUp.bind(this)}
              onKeyDown={this.handleMessageKeyDown.bind(this)}
              ref={ref => this.messageInput = ref}
              type="text"
              className="form-control chat-message-input"
              style={S('w-100p pl-70 bw-2 z-3 relative')}
              placeholder="Type your message and press enter"
            />
            <Dropzone onDrop={this.props.uploadFiles} type="button" className="btn btn-default create-message__btn" style={btn_style}>
              <span className="plus" style={S('font-22 relative t-1n')}>+</span>
            </Dropzone>
          </div>
        </form>
      </div>
    )
  }
}

// PropTypes
CreateMessageArea.propTypes = {
  data: React.PropTypes.object,
  uploadFiles: React.PropTypes.func,
  createMessage: React.PropTypes.func,
  addContactToMessage: React.PropTypes.func,
  handleContactFilterNav: React.PropTypes.func,
  handleMessageTyping: React.PropTypes.func,
  handleContactFilter: React.PropTypes.func
}
