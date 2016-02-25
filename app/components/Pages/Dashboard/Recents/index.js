// Dashboard/Index.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'

// AppDispatcher
import AppDispatcher from '../../../../dispatcher/AppDispatcher'

// AppStore
import AppStore from '../../../../stores/AppStore'

// Partials
import SideBar from '../Partials/SideBar'
import MainContent from './Partials/MainContent'
import FileViewer from './Partials/FileViewer'

export default class Dashboard extends Component {

  componentDidMount() {
    // If already mounted
    if (AppStore.data.mounted && AppStore.data.mounted.indexOf('recents') !== -1)
      return
    this.init()
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
    AppStore.data.messages = current_room.messages
    AppStore.data.scroll_bottom = true
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

  createMessage(e) {
    e.preventDefault()
    const comment = this.refs.message_input.value
    const user = this.props.data.user
    const current_room = this.props.data.current_room

    // If no comment
    if (!comment.trim())
      return false

    AppDispatcher.dispatch({
      action: 'create-message',
      user,
      room: current_room,
      comment
    })

    this.refs.message_input.value = ''
  }

  addContactsToRoom() {
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
    }
  }

  createRoom(title) {
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

  hideModal() {
    delete AppStore.data.show_listing_viewer
    delete AppStore.data.show_create_chat_modal
    delete AppStore.data.show_contacts_modal
    delete AppStore.data.show_settings_modal
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
    AppStore.emitChange()
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

  // TODO: Fix This for Arrow Keys
  navListingCarousel(index) {
    AppStore.data.current_listing.current_slide = index
    AppStore.emitChange()
  }

  render() {
    // Data
    const data = this.props.data
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
    return (
      <div style={ S('minw-1000') }>
        <main>
          <SideBar data={ data }/>
          <MainContent
            data={ data }
            getPreviousMessages={ this.getPreviousMessages.bind(this) }
            handleMessageTyping={ this.handleMessageTyping.bind(this) }
            filterRooms={ this.filterRooms.bind(this) }
            createMessage={ this.createMessage }
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
          />
        </main>
        <audio ref="notif_sound" id="notif-sound">
          <source src="/audio/goat.mp3" type="audio/mpeg" />
        </audio>
        { file_viewer }
      </div>
    )
  }
}

// PropTypes
Dashboard.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object.isRequired
}