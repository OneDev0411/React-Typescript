// MainContent.js
import React, { Component } from 'react'
import { ProgressBar } from 'react-bootstrap'
import S from 'shorti'
import RoomsList from './RoomsList'
import MessagesList from './MessagesList'
import _ from 'lodash'
import Dropzone from 'react-dropzone'

// Partials
import ProfileImage from '../../Partials/ProfileImage'
import DropzoneOverlay from '../../Partials/DropzoneOverlay'
import ListingViewer from '../../Partials/ListingViewer'

export default class MainContent extends Component {

  componentDidUpdate() {
    const data = this.props.data
    if (this.refs.message_input && !data.show_contacts_modal && !data.is_filtering)
      this.refs.message_input.focus()
  }

  handleSearchRoomKeyUp() {
    const search_text = this.refs.search_text.value
    this.props.filterRooms(search_text)
  }

  hideModal() {
    this.props.hideModal()
  }

  handleMessageKeyUp(e) {
    const message_input = this.refs.message_input.value
    const data = this.props.data
    const active_contact = data.active_contact
    // Check for @
    if (message_input.includes('@')) {
      if (e.which === 38) // up
        return this.props.handleContactFilterNav('up')
      if (e.which === 40) // down
        return this.props.handleContactFilterNav('down')
      if (e.which === 13) { // enter
        const contact = data.filtered_contacts[active_contact]
        return this.addContactToMessage(contact)
      }
      this.props.handleContactFilter(message_input, 'show')
    } else
      this.props.handleContactFilter(message_input, 'hide')
    if (this.refs.filter_contacts_scroll_area) {
      setTimeout(() => {
        if (this.refs.filter_contacts_scroll_area)
          this.refs.filter_contacts_scroll_area.scrollTop = this.refs.filter_contacts_scroll_area.scrollHeight
      }, 10)
    }
  }

  addContactToMessage(contact) {
    this.props.addContactToMessage()
    const message_input = this.refs.message_input.value
    const message_arr = message_input.split('@')
    this.refs.message_input.value = message_arr[0] + contact.first_name + ' ' + contact.last_name + ' '
  }

  createMessage(e) {
    e.preventDefault()
    const data = this.props.data
    const comment = this.refs.message_input.value
    // If no comment
    if (!comment.trim())
      return false
    if (data.active_contact === undefined) {
      this.props.createMessage(comment)
      this.refs.message_input.value = ''
    }
  }

  render() {
    // Data
    const data = this.props.data
    const main_style = S('absolute l-70 r-0')
    const rooms_column_style = {
      height: window.innerHeight,
      borderRight: '1px solid #e7e4e3',
      width: '320px'
    }
    const messages_column_style = {
      ...S('absolute pt-15 l-320 minw-450'),
      height: window.innerHeight,
      width: window.innerWidth - 391
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
    const btn_style = {
      ...S('absolute bw-2 p-0 w-56 h-34 l-22 t-22 z-101'),
      borderTop: 'none',
      borderLeft: 'none',
      borderBottom: 'none',
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0
    }
    let filtered_contacts_area
    if (data.show_filtered_contacts && data.filtered_contacts) {
      let filtered_contacts_list_items
      const filtered_contacts = data.filtered_contacts
      filtered_contacts_list_items = filtered_contacts.map((contact, i) => {
        let active_contact_style = ''
        const contact_added_style = ''
        const active_contact = data.active_contact
        if (active_contact === i)
          active_contact_style = ' bg-EDF7FD'
        if (!contact.added) {
          return (
            <div onClick={ this.addContactToMessage.bind(this, contact) } className="add-contact-form__contact" key={ 'contact-' + contact.id } style={ S('br-3 relative h-60 pointer mb-5 p-10' + active_contact_style + contact_added_style) }>
              <ProfileImage data={ data } user={ contact }/>
              <div style={ S('ml-50') }>
                <span style={ S('fw-600') }>{ contact.first_name } { contact.last_name }</span>{ contact.contact_user ? ',' : '' }&nbsp;
                <span style={ S('color-666') }>{ contact.contact_user ? contact.contact_user.user_type : '' }</span><br />
                <span style={ S('color-666 font-13') }>{ contact.email }</span><br />
              </div>
              <div className="clearfix"></div>
            </div>
          )
        }
      })
      filtered_contacts_list_items = filtered_contacts_list_items.filter(n => {
        return n !== undefined
      })
      filtered_contacts_area = (
        <div ref="filter_contacts_scroll_area" style={ { overflowY: 'scroll', ...S('absolute b-5 maxh-300 w-100p br-3 border-1-solid-ccc p-5 bg-fff') } }>
          { filtered_contacts_list_items }
        </div>
      )
    }
    if (data.current_room) {
      create_message_area = (
        <div style={ footer_style }>
          <div>
            { is_typing }
          </div>
          <div style={ S('relative') }>
            { filtered_contacts_area }
          </div>
          <form onSubmit={ this.createMessage.bind(this) }>
            <div className="form-group" style={ S('w-100p') }>
              <input onKeyUp={ this.handleMessageKeyUp.bind(this) } onKeyDown={ this.props.handleMessageTyping.bind(this) } ref="message_input" type="text" className="form-control chat-message-input" style={ S('w-100p pl-70 bw-2 z-100 relative') } placeholder="Type your message and press enter"/>
              <Dropzone onDrop={ this.props.uploadFiles } type="button" className="btn btn-default create-message__btn" style={ btn_style }>
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
    let listing_viewer
    if (data.show_listing_viewer) {
      listing_viewer = (
        <ListingViewer
          data={ data }
          listing={ data.current_listing }
          hideModal={ this.hideModal.bind(this) }
          navListingCarousel={ this.props.navListingCarousel }
          hideListingViewer={ this.props.hideListingViewer }
          showModalGallery={ this.props.showModalGallery }
          handleModalGalleryNav={ this.props.handleModalGalleryNav }
          showShareListingModal={ this.props.showShareListingModal }
        />
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
                <input ref="search_text" onKeyUp={ this.handleSearchRoomKeyUp.bind(this) } style={ S('w-82p br-100') } type="text" placeholder="Search chats" className="form-control pull-left" />
                <button onClick={ this.props.showModal.bind(this, 'create-chat') } type="button" className="btn btn-primary" style={ S('w-40 h-40 ml-6 pointer absolute p-0 t-15 r-8 br-100') }>
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
                showModal={ this.props.showModal.bind(this) }
                addContactsToRoom={ this.props.addContactsToRoom }
                hideModal={ this.hideModal.bind(this) }
                showFileViewer={ this.props.showFileViewer }
                setHeadingDate={ this.props.setHeadingDate }
                removeScrollBottom={ this.props.removeScrollBottom }
                showListingViewer={ this.props.showListingViewer }
                changeListingNotification={ this.props.changeListingNotification }
                showAlertViewer={ this.props.showAlertViewer }
              />
              { uploading_area }
              { create_message_area }
            </div>
          </div>
        </Dropzone>
        <DropzoneOverlay
          overlay_active={ overlay_active }
          title={ overlay_title }
          context="room"
        />
        { listing_viewer }
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
  createMessage: React.PropTypes.func.isRequired,
  handleMessageTyping: React.PropTypes.func.isRequired,
  handleContactFilter: React.PropTypes.func.isRequired,
  handleContactFilterNav: React.PropTypes.func.isRequired,
  setCurrentRoom: React.PropTypes.func.isRequired,
  getPreviousMessages: React.PropTypes.func.isRequired,
  addContactsToRoom: React.PropTypes.func.isRequired,
  handleDragEnter: React.PropTypes.func.isRequired,
  handleDragLeave: React.PropTypes.func.isRequired,
  uploadFiles: React.PropTypes.func.isRequired,
  showFileViewer: React.PropTypes.func,
  setHeadingDate: React.PropTypes.func,
  removeScrollBottom: React.PropTypes.func,
  showListingViewer: React.PropTypes.func,
  changeListingNotification: React.PropTypes.func,
  navListingCarousel: React.PropTypes.func,
  addContactToMessage: React.PropTypes.func,
  hideListingViewer: React.PropTypes.func,
  showModalGallery: React.PropTypes.func,
  handleModalGalleryNav: React.PropTypes.func,
  showShareListingModal: React.PropTypes.func,
  showAlertViewer: React.PropTypes.func
}