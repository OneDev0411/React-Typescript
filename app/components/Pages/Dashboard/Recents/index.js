// Recents/Index.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'
import { Modal, Input, Button } from 'react-bootstrap'
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import AppStore from '../../../../stores/AppStore'
import controller from '../controller'
import SideBar from '../Partials/SideBar'
import MobileNav from '../Partials/MobileNav'
import MainContent from './Partials/MainContent'
import FileViewer from './Partials/FileViewer'

export default class Dashboard extends Component {

  componentWillMount() {
    AppStore.data.loading = true
    AppStore.emitChange()
  }

  componentDidMount() {
    // If already mounted
    if (AppStore.data.mounted && AppStore.data.mounted.indexOf('recents') !== -1)
      return
    this.init()
    this.getContacts()

    const socket = window.socket
    socket.on('Notification', notification => {
      if (notification.action !== 'Joined')
        return null

      if (notification.subject_class !== 'User')
        return null

      if (notification.object_class !== 'Room')
        return null

      const data = this.props.data
      const user = data.user
      const current_room = data.current_room
      let room_id
      if (current_room)
        room_id = data.current_room.id
      AppDispatcher.dispatch({
        action: 'get-rooms',
        user,
        room_id
      })
    })
  }

  componentWillUpdate() {
    window.addEventListener('resize', this.handleResize)
    const data = this.props.data
    if (data.play_sound) {
      this.refs.notif_sound.play()
      delete AppStore.data.play_sound
      AppStore.emitChange()
    }
  }

  getContacts() {
    const data = this.props.data
    AppDispatcher.dispatch({
      action: 'get-contacts',
      user: data.user
    })
  }

  getPreviousMessages(scroll_height) {
    const data = this.props.data
    const user = data.user
    const current_room = data.current_room
    AppDispatcher.dispatch({
      action: 'get-previous-messages',
      user,
      room: current_room,
      scroll_height
    })
  }

  setCurrentRoom(current_room) {
    AppStore.data.current_room = current_room
    AppStore.data.scroll_bottom = true
    if (AppStore.data.is_mobile)
      AppStore.data.current_room_mobile = current_room
    AppStore.emitChange()
    history.pushState(null, null, '/dashboard/recents/' + current_room.id)
  }

  removeScrollBottom() {
    delete AppStore.data.scroll_bottom
    AppStore.emitChange()
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

  createMessage(comment) {
    const data = this.props.data
    const user = data.user
    const current_room = data.current_room
    AppDispatcher.dispatch({
      action: 'create-message',
      user,
      room: current_room,
      comment
    })
  }

  addContactsToRoom() {
    delete AppStore.data.add_contacts_error
    AppStore.emitChange()
    const contacts_added = AppStore.data.contacts_added
    const user = AppStore.data.user
    const room = this.props.data.current_room
    if (contacts_added && contacts_added.room) {
      AppStore.data.adding_contacts = true
      AppStore.emitChange()
      const contacts = contacts_added.room
      AppDispatcher.dispatch({
        action: 'invite-contacts',
        user,
        room,
        contacts
      })
      // Create contacts if email or phone
      const new_contacts = contacts_added.room.filter(contact => {
        return contact.type !== 'contact'
      })
      if (new_contacts) {
        AppDispatcher.dispatch({
          action: 'create-contacts',
          user,
          contacts: new_contacts
        })
      }
    }
  }

  createRoom(e) {
    e.preventDefault()
    const title = this.refs.title.getInputDOMNode().value.trim()
    if (!title)
      return
    const user = AppStore.data.user
    AppDispatcher.dispatch({
      action: 'create-room',
      user,
      title
    })
  }

  showModal(modal_key) {
    if (modal_key === 'create-chat')
      AppStore.data.show_create_chat_modal = true
    if (modal_key === 'invite-user')
      AppStore.data.show_contacts_modal = true
    if (modal_key === 'settings')
      AppStore.data.show_settings_modal = true
    AppStore.emitChange()
  }

  onModalShow() {
    setTimeout(() => {
      this.refs.title.getInputDOMNode().focus()
    }, 300)
  }

  hideModal() {
    delete AppStore.data.show_create_chat_modal
    delete AppStore.data.show_contacts_modal
    delete AppStore.data.show_settings_modal
    delete AppStore.data.show_modal_gallery
    delete AppStore.data.show_alert_viewer
    delete AppStore.data.adding_contacts
    delete AppStore.data.add_contacts_error
    AppStore.emitChange()
  }

  sendTypingStarted() {
    const data = AppStore.data
    const socket = window.socket
    AppStore.data.is_typing = data.user
    AppStore.emitChange()
    socket.emit('User.Typing', AppStore.data.current_room.id)
  }

  sendTypingEnded() {
    const socket = window.socket
    socket.emit('User.TypingEnded', AppStore.data.current_room.id)
    delete AppStore.data.is_typing
    AppStore.emitChange()
  }

  handleMessageTyping() {
    const data = AppStore.data
    if (!data.is_typing)
      this.sendTypingStarted()
    if (window.is_typing_timeout) {
      clearTimeout(window.is_typing_timeout)
      delete window.is_typing_timeout
    }
    // Send stopped typing event
    window.is_typing_timeout = setTimeout(() => {
      this.sendTypingEnded()
    }, 3000)
  }

  handleContactFilterNav(direction) {
    this.setContactActive(direction)
  }

  setContactActive(direction) {
    const data = this.props.data
    const filtered_contacts = data.filtered_contacts
    let active_contact = -1
    // Prev active contact
    if (data.active_contact !== null)
      active_contact = data.active_contact
    if (direction === 'up') {
      if (active_contact > -1)
        active_contact = active_contact - 1
      else
        active_contact = filtered_contacts.length - 1
    }
    if (direction === 'down') {
      if (filtered_contacts && active_contact < filtered_contacts.length - 1)
        active_contact = active_contact + 1
      else
        active_contact = 0
    }
    AppStore.data.active_contact = active_contact
    AppStore.emitChange()
  }

  handleContactFilter(message_input, type) {
    if (type === 'show') {
      const data = this.props.data
      const current_room = data.current_room
      if (!current_room)
        return
      const contacts = current_room.users
      const message_arr = message_input.split('@')
      const filtered_contacts = contacts.filter(contact => {
        if (contact.first_name && contact.first_name.toLowerCase().indexOf(message_arr[1].toLowerCase()) !== -1)
          return contact
        if (contact.last_name && contact.last_name.toLowerCase().indexOf(message_arr[1].toLowerCase()) !== -1)
          return contact
        if (contact.email && contact.email.toLowerCase().indexOf(message_arr[1].toLowerCase()) !== -1)
          return contact
        return false
      })
      AppStore.data.active_contact = filtered_contacts.length - 1
      AppStore.data.show_filtered_contacts = true
      AppStore.data.filtered_contacts = filtered_contacts
      AppStore.data.message_input = message_input
    } else {
      delete AppStore.data.active_contact
      delete AppStore.data.filtered_contacts
      delete AppStore.data.show_filtered_contacts
      delete AppStore.data.message_input
    }
    AppStore.emitChange()
  }

  addContactToMessage() {
    this.handleContactFilter('', 'hide')
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
    const data = this.props.data
    const search_text_lower = search_text.toLowerCase().trim()
    const rooms = data.rooms
    const filtered_rooms = rooms.filter(room => {
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
    AppStore.data.messages_loading = true
    AppStore.emitChange()
    this.addUserToStore()
    this.getUserRooms()
    window.addEventListener('resize', this.handleResize)
    // Add mounted recents to store
    if (!AppStore.data.mounted)
      AppStore.data.mounted = []
    AppStore.data.mounted.push('recents')
  }

  // Add file
  handleDragEnter() {
    AppStore.data.current_room.overlay_active = true
    AppStore.emitChange()
  }

  handleDragLeave() {
    delete AppStore.data.current_room.overlay_active
    AppStore.emitChange()
  }

  uploadFiles(files) {
    const data = this.props.data
    const user = data.user
    const room = data.current_room
    delete AppStore.data.current_room.overlay_active
    AppStore.data.current_room.uploading_files = true
    AppStore.emitChange()
    AppDispatcher.dispatch({
      action: 'upload-files-to-room',
      user,
      room,
      files
    })
  }

  showFileViewer(attachment) {
    AppStore.data.current_room.viewer = {
      file: attachment
    }
    AppStore.emitChange()
  }

  closeFileViewer() {
    delete AppStore.data.current_room.viewer
    AppStore.emitChange()
  }

  setHeadingDate(date) {
    AppStore.data.heading_date = date
    AppStore.emitChange()
  }

  showListingViewer(listing) {
    AppStore.data.show_listing_viewer = true
    AppStore.data.current_listing = listing
    delete AppStore.data.show_alert_viewer
    history.pushState(null, null, '/dashboard/mls/' + listing.id)
    AppStore.emitChange()
  }

  hideListingViewer() {
    const data = AppStore.data
    const current_room = data.current_room
    delete AppStore.data.show_listing_viewer
    history.pushState(null, null, '/dashboard/recents/' + current_room.id)
    AppStore.emitChange()
  }

  changeListingNotification(listing_switch_checked) {
    const data = this.props.data
    const user = data.user
    if (listing_switch_checked)
      AppStore.data.current_room.notification_settings[data.user.id].system_generated = false
    else
      AppStore.data.current_room.notification_settings[data.user.id].system_generated = true
    const notification = AppStore.data.current_room.notification_settings[data.user.id].system_generated
    AppDispatcher.dispatch({
      action: 'room-notifications',
      user,
      id: data.current_room.id,
      notification
    })
    AppStore.emitChange()
  }
  navListingCarousel(index) {
    if (!AppStore.data.current_listing)
      return
    AppStore.data.current_listing.current_slide = index
    AppStore.emitChange()
  }

  showModalGallery(image_url) {
    if (!image_url)
      return
    const data = AppStore.data
    const gallery_image_urls = data.current_listing.gallery_image_urls
    const image_index = gallery_image_urls.indexOf(image_url)
    AppStore.data.show_modal_gallery = true
    AppStore.data.modal_gallery = {
      current_index: image_index,
      gallery_image_urls
    }
    AppStore.emitChange()
  }

  handleModalGalleryNav(selectedIndex, selectedDirection) {
    const data = AppStore.data
    const gallery_image_urls = data.current_listing.gallery_image_urls
    const current_index = AppStore.data.modal_gallery.current_index
    if (selectedDirection === 'prev')
      AppStore.data.modal_gallery.current_index = current_index - 1
    if (selectedDirection === 'next')
      AppStore.data.modal_gallery.current_index = current_index + 1
    if (AppStore.data.modal_gallery.current_index === -1)
      AppStore.data.modal_gallery.current_index = gallery_image_urls.length - 1
    if (AppStore.data.modal_gallery.current_index === gallery_image_urls.length)
      AppStore.data.modal_gallery.current_index = 0
    AppStore.data.modal_gallery.direction = selectedDirection
    AppStore.emitChange()
  }

  render() {
    // Data
    const data = this.props.data
    const rooms = data.rooms
    const current_room = data.current_room
    let file_viewer
    if (current_room && current_room.viewer) {
      file_viewer = (
        <FileViewer
          data={ data }
          closeFileViewer={ this.closeFileViewer }
        />
      )
    }
    let main_content = (
      <MainContent
        data={ data }
        getPreviousMessages={ this.getPreviousMessages.bind(this) }
        handleMessageTyping={ this.handleMessageTyping.bind(this) }
        handleContactFilter={ this.handleContactFilter.bind(this) }
        handleContactFilterNav={ this.handleContactFilterNav.bind(this) }
        filterRooms={ this.filterRooms.bind(this) }
        createMessage={ this.createMessage.bind(this) }
        showModal={ this.showModal }
        hideModal={ this.hideModal }
        createRoom={ this.createRoom }
        setCurrentRoom={ this.setCurrentRoom.bind(this) }
        addContactsToRoom={ this.addContactsToRoom }
        handleDragEnter={ this.handleDragEnter }
        handleDragLeave={ this.handleDragLeave }
        uploadFiles={ this.uploadFiles.bind(this) }
        showFileViewer={ this.showFileViewer }
        setHeadingDate={ this.setHeadingDate }
        removeScrollBottom={ this.removeScrollBottom }
        showListingViewer={ this.showListingViewer }
        changeListingNotification={ this.changeListingNotification }
        navListingCarousel={ this.navListingCarousel }
        addContactToMessage={ this.addContactToMessage }
        hideListingViewer={ this.hideListingViewer }
        showModalGallery={ this.showModalGallery }
        handleModalGalleryNav={ this.handleModalGalleryNav }
        showShareListingModal={ controller.listing_viewer.showShareListingModal }
        showAlertViewer={ controller.alert_viewer.showAlertViewer }
        hideAlertViewer={ controller.alert_viewer.hideAlertViewer }
        setAlertGalleryActiveIndex={ controller.alert_viewer.setAlertGalleryActiveIndex }
        showDeleteRoomModal={ controller.recents.showDeleteRoomModal }
        hideDeleteRoomModal={ controller.recents.hideDeleteRoomModal }
        confirmDeleteRoom={ controller.recents.confirmDeleteRoom }
      />
    )
    if (!rooms) {
      // Empty state
      main_content = (
        <div style={ S('absolute h-100p w-100p') }>
          <div style={ S('h-220 w-360 relative center-block t-30p br-5 text-center') }>
            <div className="empty-state" style={ S('w-360 h-220 mb-25 relative br-5 p-25 border-1-solid-e2e2e2') }>
              <img src="/images/empty-states/chats.jpg" />
            </div>
            <div style={ S('mb-25') }>
              <div style={ S('color-929292 font-18') }>Start a Conversation</div>
              <div style={ S('color-bebebe font-14') }>Conversations are awesome. Start one now.</div>
            </div>
            <Button onClick={ this.showModal.bind(this, 'create-chat') } style={ S('w-200 p-0') } bsStyle="primary">
              <img src="/images/dashboard/icons/create-chat.svg" />
            </Button>
          </div>
        </div>
      )
    }
    let nav_area = (
      <SideBar data={ data }/>
    )
    if (data.is_mobile && data.user) {
      nav_area = (
        <MobileNav data={ data }/>
      )
    }
    let main_style = S('minw-1000')
    if (data.is_mobile)
      main_style = S('w-' + window.innerWidth)
    return (
      <div style={ main_style }>
        <main>
          { nav_area }
          { main_content }
        </main>
        <audio ref="notif_sound" id="notif-sound">
          <source src="/audio/ding.mp3" type="audio/mpeg" />
        </audio>
        { file_viewer }
        <Modal dialogClassName={ data.is_mobile ? 'modal-mobile' : '' } show={ data.show_create_chat_modal } onHide={ this.hideModal.bind(this) } onShow={ this.onModalShow.bind(this) }>
          <form onSubmit={ this.createRoom.bind(this) }>
            <Modal.Header closeButton>
              <Modal.Title>Start a new chat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Input type="text" ref="title" placeholder="Chat room title"/>
            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle="link" onClick={ this.hideModal.bind(this) }>Cancel</Button>
              <Button type="submit" bsStyle="primary">Start chat</Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    )
  }
}

// PropTypes
Dashboard.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object.isRequired
}