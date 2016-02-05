// MainContent.js
import React, { Component } from 'react'
import { Modal, Button, Input, ProgressBar } from 'react-bootstrap'
import S from 'shorti'
import RoomsList from './RoomsList'
import MessagesList from './MessagesList'
import _ from 'lodash'
import Dropzone from 'react-dropzone'

// Partials
import DropzoneOverlay from '../../Partials/DropzoneOverlay'

export default class MainContent extends Component {

  componentDidUpdate() {
    if (this.refs.message_input)
      this.refs.message_input.focus()
  }

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
    let create_message_area = ''
    if (data.current_room) {
      create_message_area = (
        <div style={ footer_style }>
          <div>
            { is_typing }
          </div>
          <form onSubmit={ this.props.createMessage.bind(this) }>
            <div className="form-group" style={ S('w-100p') }>
              <input onKeyDown={ this.props.handleMessageTyping.bind(this) } ref="message_input" type="text" className="form-control" style={ S('w-100p pl-70 bw-2') } placeholder="Type your message and press enter"/>
              <Dropzone onDrop={ this.props.uploadFiles } type="button" className="btn btn-default create-message__btn" style={ S('absolute bw-2 p-0 w-56 h-38 l-20 t-20') }>
                <span className="plus" style={ S('font-22 relative t-1n') }>+</span>
              </Dropzone>
            </div>
          </form>
        </div>
      )
    }
    let overlay_active
    let overlay_title = ''
    if (data.current_room) {
      overlay_active = data.current_room.overlay_active
      overlay_title = data.current_room.title
    }
    let uploading_area
    if (data.current_room && data.current_room.uploading_files) {
      let upload_percent = 0
      if (data.current_room.upload_percent)
        upload_percent = data.current_room.upload_percent
      uploading_area = (
        <div style={ S('p-20 w-100p relative t-35n')}>
          <ProgressBar active striped bsStyle="success" now={ upload_percent } />
        </div>
      )
    }
    return (
      <div>
        <Dropzone
          style={ S('w-100p h-100p') }
          disableClick
          onDragEnter={ this.props.handleDragEnter }
          onDragLeave={ this.props.handleDragLeave }
          onDrop={ this.props.uploadFiles }
        >
          <div style={ main_style }>
            <div className="dashboard__chat-rooms pull-left" style={ rooms_column_style }>
              <div style={ S('p-10 pt-15 h-60 relative') }>
                <input ref="search_text" onKeyUp={ this.handleKeyUp.bind(this) } style={ S('w-85p br-10') } type="text" placeholder="Search chats" className="form-control pull-left" />
                <button onClick={ this.showModal.bind(this, 'create-chat') } type="button" className="btn btn-primary" style={ S('w-40 h-40 ml-6 pointer absolute p-0 t-15 r-8 br-100') }>
                  <img src="/images/dashboard/icons/create-chat.svg"/>
                </button>
                <div className="clearfix"></div>
              </div>
              <RoomsList
                setCurrentRoom={ this.props.setCurrentRoom }
                data={ data }
              />
            </div>
            <div className="dashboard__messages pull-left" style={ messages_column_style }>
              <MessagesList
                data={ data }
                getPreviousMessages={ this.props.getPreviousMessages }
                showModal={ this.showModal.bind(this) }
                addContactsToRoom={ this.props.addContactsToRoom }
                hideModal={ this.hideModal.bind(this) }
                showFileViewer={ this.props.showFileViewer }
                setHeadingDate={ this.props.setHeadingDate }
                removeScrollBottom={ this.props.removeScrollBottom }
              />
              { uploading_area }
              { create_message_area }
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
        </Dropzone>
        <DropzoneOverlay
          overlay_active={ overlay_active }
          title={ overlay_title }
          context="room"
        />
      </div>
    )
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
  setCurrentRoom: React.PropTypes.func.isRequired,
  getPreviousMessages: React.PropTypes.func.isRequired,
  addContactsToRoom: React.PropTypes.func.isRequired,
  handleDragEnter: React.PropTypes.func.isRequired,
  handleDragLeave: React.PropTypes.func.isRequired,
  uploadFiles: React.PropTypes.func.isRequired,
  showFileViewer: React.PropTypes.func,
  setHeadingDate: React.PropTypes.func,
  removeScrollBottom: React.PropTypes.func
}