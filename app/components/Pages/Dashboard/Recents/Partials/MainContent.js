// MainContent.js
import React, { Component } from 'react'
import { ProgressBar } from 'react-bootstrap'
import S from 'shorti'
import RoomsList from './RoomsList'
import MessagesList from './MessagesList'
import _ from 'lodash'
import Dropzone from 'react-dropzone'
import controller from '../../controller'

// Partials
import ProfileImage from '../../Partials/ProfileImage'
import DropzoneOverlay from '../../Partials/DropzoneOverlay'
import ListingViewer from '../../Partials/ListingViewer'
import ListingViewerMobile from '../../Partials/ListingViewerMobile'
import NewMessageViewer from './NewMessageViewer'
export default class MainContent extends Component {
  handleSearchRoomChange() {
    const search_rooms_input = this.refs.search_rooms_input.value
    this.props.filterRooms(search_rooms_input)
  }
  hideModal() {
    this.props.hideModal()
  }
  handleMessageKeyDown(e) {
    const data = this.props.data
    const active_contact = data.active_contact
    if (e.which === 9) { // tab
      e.preventDefault()
      const contact = data.filtered_contacts[active_contact]
      if (contact)
        this.addContactToMessage(contact)
    } else
      this.props.handleMessageTyping()
  }
  handleMessageKeyUp(e) {
    const message_input = this.refs.message_input.value
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
        const contact = data.filtered_contacts[active_contact]
        if (contact)
          this.addContactToMessage(contact)
        else
          this.createMessage(e)
        return ''
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
    this.refs.message_input.focus()
  }
  handleSubmit(e) {
    e.preventDefault()
    this.createMessage()
  }
  createMessage() {
    const data = this.props.data
    const comment = this.refs.message_input.value
    // If no comment
    if (!comment.trim())
      return false
    if (data.active_contact === undefined || data.active_contact === -1) {
      this.props.createMessage(comment)
      this.refs.message_input.value = ''
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
    const main_style = S('absolute l-70 r-0')
    const rooms_column_style = {
      height: window.innerHeight,
      borderRight: '1px solid #e7e4e3',
      width: '340px'
    }
    const messages_column_style = {
      ...S('absolute l-340 minw-450'),
      height: window.innerHeight,
      width: window.innerWidth - 411
    }
    let footer_style = S('absolute w-100p l-0 b-0 r-0 p-20 pb-10')
    // Mobile footer
    if (data.is_mobile) {
      footer_style = {
        ...footer_style,
        ...S('b-55 z-3 bg-fff')
      }
    }
    let is_typing
    if (data.is_typing && data.is_typing.author_id !== data.user.id && data.is_typing.room_id === data.current_room.id) {
      // Get user name
      const author_typing = _.find(data.current_room.users, { id: data.is_typing.author_id })
      if (author_typing) {
        is_typing = (
          <div style={ S('absolute l-20 t-0 font-12') }>
            { author_typing.first_name } is typing...
          </div>
        )
      }
    }
    // Reconnect message
    let is_reconnecting
    if (data.socket_reconnecting) {
      is_reconnecting = (
        <div style={ S('absolute l-20 t-0 font-12') }>
          Lost connection.  Reconnecting...
        </div>
      )
    }
    if (data.socket_reconnected) {
      is_reconnecting = (
        <div style={ S('absolute l-20 t-0 font-12') }>
          Reconnected!
        </div>
      )
    }
    // Create message form
    let create_message_area = ''
    const btn_style = {
      ...S('absolute bw-2 p-0 w-56 h-34 l-22 t-22 z-4'),
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
        <div ref="filter_contacts_scroll_area" style={ { overflowY: 'scroll', ...S('z-1000 absolute b-5 maxh-300 w-100p br-3 border-1-solid-ccc p-5 bg-fff') } }>
          { filtered_contacts_list_items }
        </div>
      )
    }
    if (data.current_room) {
      create_message_area = (
        <div style={ footer_style }>
          <div>
            { is_reconnecting } { is_typing }
          </div>
          <div style={ S('relative') }>
            { filtered_contacts_area }
          </div>
          <form onSubmit={ this.handleSubmit.bind(this) }>
            <div className="form-group" style={ S('w-100p') }>
              <input onBlur={ this.handleBlur.bind(this) } onKeyUp={ this.handleMessageKeyUp.bind(this) } onKeyDown={ this.handleMessageKeyDown.bind(this) } ref="message_input" type="text" className="form-control chat-message-input" style={ S('w-100p pl-70 bw-2 z-3 relative') } placeholder="Type your message and press enter"/>
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
      let progress_bar_style = S('p-20 w-100p relative t-35n')
      if (data.is_mobile)
        progress_bar_style = S('p-20 w-100p absolute b-78 z-10')
      uploading_area = (
        <div style={ progress_bar_style }>
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
      // Check for mobile
      if (data.is_mobile) {
        listing_viewer = (
          <ListingViewerMobile
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
    }
    // Mobile
    if (data.is_mobile) {
      if (data.show_listing_viewer) {
        return (
          <ListingViewerMobile
            data={ data }
            listing={ data.current_listing }
            hideModal={ controller.listing_map.hideModal }
            hideListingViewer={ controller.listing_viewer.hideListingViewer }
            showModalGallery={ controller.listing_viewer.showModalGallery }
            handleModalGalleryNav={ controller.listing_viewer.handleModalGalleryNav }
            showShareListingModal={ controller.listing_viewer.showShareListingModal }
          />
        )
      }
      if (!data.current_room_mobile) {
        const main_style_mobile = S('w-' + window.innerWidth)
        return (
          <div style={ main_style_mobile }>
            <div style={ S('p-10 pt-15 h-60 relative') }>
              <img style={ S('w-12 h-12 absolute l-20 t-28') } src="/images/dashboard/chats/search.svg" />
              <input ref="search_rooms_input" onChange={ this.handleSearchRoomChange.bind(this) } style={ S('w-170 br-5 bg-f8fafb pl-30 h-34') } type="text" placeholder="Search" className="form-control pull-left" value={ data.search_rooms_input }/>
              <button onClick={ this.props.showNewMessageView.bind(this) } type="button" className="btn btn-primary" style={ S('h-34 pointer absolute p-0 t-14 r-10 br-100') }>
                <img src="/images/dashboard/chats/pencil.svg" style={ S('mr-10') }/>New Message
              </button>
              <div className="clearfix"></div>
            </div>
            <RoomsList
              setCurrentRoom={ this.props.setCurrentRoom }
              data={ data }
            />
          </div>
        )
      }
      // Messages
      const main_style_mobile = S('w-' + window.innerWidth)
      return (
        <div style={ main_style_mobile }>
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
            showAlertModal={ this.props.showAlertModal }
            hideAlertModal={ this.props.hideAlertModal }
            showDeleteRoomModal={ this.props.showDeleteRoomModal }
            hideDeleteRoomModal={ this.props.hideDeleteRoomModal }
            confirmDeleteRoom={ this.props.confirmDeleteRoom }
            setAlertGalleryActiveIndex={ this.props.setAlertGalleryActiveIndex }
          />
          { uploading_area }
          { create_message_area }
        </div>
      )
    } // end mobile
    let clear_search_btn
    if (data.search_rooms_input) {
      clear_search_btn = (
        <div onClick={ this.props.clearRoomSearchText.bind(this) } className="close" style={ S('absolute l-230 t-23') }>&times;</div>
      )
    }
    let messages_area = (
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
        showAlertModal={ this.props.showAlertModal }
        hideAlertModal={ this.props.hideAlertModal }
        showDeleteRoomModal={ this.props.showDeleteRoomModal }
        hideDeleteRoomModal={ this.props.hideDeleteRoomModal }
        confirmDeleteRoom={ this.props.confirmDeleteRoom }
        setAlertGalleryActiveIndex={ this.props.setAlertGalleryActiveIndex }
      />
    )
    if (data.show_new_message_viewer) {
      messages_area = (
        <NewMessageViewer
          data={ data }
          addRoomsToSearchInput={ this.props.addRoomsToSearchInput }
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
              <div style={ S('p-10 pt-12 h-60 relative border-bottom-1-solid-eeeff3') }>
                <img style={ S('w-12 h-12 absolute l-20 t-23') } src="/images/dashboard/chats/search.svg" />
                { clear_search_btn }
                <input ref="search_rooms_input" onChange={ this.handleSearchRoomChange.bind(this) } style={ S('w-170 br-5 bg-f8fafb pl-30 h-34') } type="text" placeholder="Search" className="form-control pull-left" value={ data.search_rooms_input } />
                <button onClick={ this.props.showNewMessageView.bind(this) } type="button" className="btn btn-primary" style={ S('pointer absolute t-12 r-10 br-5 pt-7 h-34') }>
                  <img src="/images/dashboard/chats/pencil.svg" style={ S('mr-10') }/>New Message
                </button>
                <div className="clearfix"></div>
              </div>
              <RoomsList
                setCurrentRoom={ this.props.setCurrentRoom }
                data={ data }
              />
            </div>
            <div className="dashboard__messages pull-left" style={ messages_column_style }>
              { messages_area }
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
  showAlertModal: React.PropTypes.func,
  hideAlertModal: React.PropTypes.func,
  showDeleteRoomModal: React.PropTypes.func,
  hideDeleteRoomModal: React.PropTypes.func,
  confirmDeleteRoom: React.PropTypes.func,
  setAlertGalleryActiveIndex: React.PropTypes.func,
  clearRoomSearchText: React.PropTypes.func,
  showNewMessageView: React.PropTypes.func,
  addRoomsToSearchInput: React.PropTypes.func
}