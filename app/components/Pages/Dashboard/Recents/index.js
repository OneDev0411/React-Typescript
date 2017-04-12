// Recents/Index.js
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import S from 'shorti'
import _ from 'lodash'
import validator from 'validator'
import { Modal, FormControl, Button, Alert } from 'react-bootstrap'
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import AppStore from '../../../../stores/AppStore'
import controller from '../controller'
import SideBar from '../Partials/SideBar'
import MobileNav from '../Partials/MobileNav'
import MainContent from './Partials/MainContent'
import FileViewer from './Partials/FileViewer'
import Select from 'react-select'
import SelectContainer from '../Partials/SelectContainer'
import { getResizeAvatarUrl } from '../../../../utils/user'
import ProfileImage from '../Partials/ProfileImage'
import ProfileImageMultiple from '../Partials/ProfileImageMultiple'
import MobileSplashViewer from '../../../Partials/MobileSplashViewer'

export default class Dashboard extends Component {
  componentWillMount() {
    AppStore.data.loading = true
    AppStore.emitChange()
  }

  componentDidMount() {
    // Esc pressed on new message viewer
    document.onkeydown = (e) => {
      if (e.which === 27 && this.props.data.show_new_message_viewer) {
        delete AppStore.data.show_new_message_viewer
        AppStore.data.current_room = AppStore.data.rooms[0]
        AppStore.emitChange()
      }
    }
    // If already mounted
    if (AppStore.data.mounted && AppStore.data.mounted.indexOf('recents') !== -1)
      return
    this.init()

    const socket = window.socket
    socket.on('Notification', (notification) => {
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
      this.notif_sound.play()
      delete AppStore.data.play_sound
      AppStore.emitChange()
    }
  }

  getRoomsIndexedDB() {
    const data = this.props.data
    const user = data.user
    AppDispatcher.dispatch({
      action: 'get-rooms-indexeddb',
      user_id: user.id
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
    delete AppStore.data.show_new_message_viewer
    if (AppStore.data.is_mobile)
      AppStore.data.current_room_mobile = current_room
    delete AppStore.data.show_room_users_modal
    AppStore.emitChange()
    browserHistory.push(`/dashboard/recents/${current_room.id}`)
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
    if (!current_room) {
      const items_selected = data.new_message.items_selected
      const users = _.map(_.filter(items_selected, { type: 'user' }), 'value.id')
      const phone_numbers = _.map(_.filter(items_selected, { type: 'phone_number' }), 'value')
      const emails = _.map(_.filter(items_selected, { type: 'email' }), 'value')
      AppDispatcher.dispatch({
        action: 'create-room',
        user,
        users,
        emails,
        phone_numbers,
        comment
      })
      return
    }
    AppDispatcher.dispatch({
      action: 'create-message',
      user,
      room: current_room,
      comment
    })
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
    if (modal_key === 'settings')
      AppStore.data.show_settings_modal = true
    if (modal_key === 'room-users')
      AppStore.data.show_room_users_modal = true
    if (modal_key === 'add-members')
      AppStore.data.show_add_members_modal = true
    AppStore.emitChange()
  }

  onModalShow() {
    setTimeout(() => {
      this.refs.title.getInputDOMNode().focus()
    }, 300)
  }

  hideModal() {
    delete AppStore.data.show_create_chat_modal
    delete AppStore.data.show_settings_modal
    delete AppStore.data.show_room_users_modal
    delete AppStore.data.show_modal_gallery
    delete AppStore.data.show_alert_modal
    delete AppStore.data.show_add_members_modal
    delete AppStore.data.show_room_saved_message
    AppStore.emitChange()
  }

  sendTypingStarted() {
    const data = AppStore.data
    const socket = window.socket
    AppStore.data.is_typing = data.user
    AppStore.emitChange()
    if (AppStore.data.current_room)
      socket.emit('User.Typing', AppStore.data.current_room.id)
  }

  sendTypingEnded() {
    const socket = window.socket
    if (AppStore.data.current_room)
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

  }

  handleContactFilter(message_input, type) {
    if (type === 'show') {
      const data = this.props.data
      const current_room = data.current_room
      if (!current_room)
        return
      const contacts = current_room.users
      const message_arr = message_input.split('@')
      const filtered_contacts = contacts.filter((contact) => {
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

  filterRooms(search_rooms_input) {
    const data = this.props.data
    const search_text_lower = search_rooms_input.toLowerCase().trim()
    const rooms = data.rooms
    const filtered_rooms = rooms.filter((room) => {
      const users_first_string = _.map(room.users, 'first_name').toString().toLowerCase()
      const users_last_string = _.map(room.users, 'last_name').toString().toLowerCase()
      if (users_first_string.indexOf(search_text_lower) !== -1)
        return true
      if (users_last_string.indexOf(search_text_lower) !== -1)
        return true
      return false
    })
    if (!search_text_lower)
      delete AppStore.data.is_filtering
    else
      AppStore.data.is_filtering = true
    AppStore.data.search_rooms_input = search_rooms_input
    AppStore.data.filtered_rooms = filtered_rooms
    AppStore.emitChange()
  }

  init() {
    this.getRoomsIndexedDB()
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
    AppStore.data.show_file_viewer = true
    AppStore.data.current_room.viewer = {
      file: attachment
    }
    AppStore.emitChange()
  }

  closeFileViewer() {
    delete AppStore.data.current_room.viewer
    delete AppStore.data.show_file_viewer
    AppStore.emitChange()
  }

  setHeadingDate(date) {
    AppStore.data.heading_date = date
    AppStore.emitChange()
  }

  showListingViewer(listing) {
    if (AppStore.data.show_file_viewer)
      return
    AppStore.data.show_listing_viewer = true
    AppStore.data.current_listing = listing
    delete AppStore.data.show_alert_modal
    browserHistory.push(`/dashboard/mls/${listing.id}`)
    AppStore.emitChange()
  }

  hideListingViewer() {
    const data = AppStore.data
    const current_room = data.current_room
    delete AppStore.data.show_listing_viewer
    browserHistory.push(`/dashboard/recents/${current_room.id}`)
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

  inputChange(e) {
    // Enter clicked
    const data = this.props.data
    if (e.which === 13 || e.which === 9) {
      e.preventDefault()
      if (data.add_members && data.add_members.search_value) {
        if (!data.add_members.items_selected)
          data.add_members.items_selected = []
        const search_value = data.add_members.search_value
        // Emails
        if (validator.isEmail(search_value)) {
          data.add_members.items_selected.push({
            email: search_value,
            type: 'email',
            label: search_value,
            value: search_value
          })
          controller.add_members.addUsersToSearchInput(data.add_members.items_selected)
        }
        // Phone numbers
        if (validator.isNumeric(search_value)) {
          data.add_members.items_selected.push({
            email: search_value,
            type: 'phone_number',
            label: search_value,
            value: search_value
          })
          controller.add_members.addUsersToSearchInput(data.add_members.items_selected)
        }
        this.myselect.refs.input.blur()
      }
    }
  }
  handleChange(users_selected) {
    controller.add_members.addUsersToSearchInput(users_selected)
  }
  handleInputChange(value) {
    controller.add_members.handleInputChange(value)
  }
  handleValueRenderer(item) {
    let profile_image
    const user = item.value
    if (user.profile_image_url || user.display_profile_image_url) {
      let profile_image_url
      if (user.profile_image_url)
        profile_image_url = user.profile_image_url
      if (user.display_profile_image_url)
        profile_image_url = user.display_profile_image_url
      profile_image = <div style={S(`pull-left bg-url(${getResizeAvatarUrl(profile_image_url)}?w=160) w-26 h-26 bg-cover bg-center`)} />
    }
    const display_name = (
      <div style={S('pull-left mt-4 ml-10 mr-5')}>
        { item.label }
      </div>
    )
    return (
      <div>
        { profile_image }
        { display_name }
      </div>
    )
  }
  handleOptionRenderer(item) {
    const data = this.props.data
    let profile_image
    if (item.type === 'room') {
      // Room
      profile_image = (
        <ProfileImageMultiple users={item.value.users} />
      )
    } else {
      // Contact
      const user = item.value
      profile_image = (
        <ProfileImage data={data} user={user} />
      )
    }
    return (
      <div style={S('relative h-54')}>
        <div style={S('mt-10')}>{ profile_image }</div>
        <div style={S('pull-left mt-10 ml-60 mr-5')}>{ item.label }</div>
        <div className="clearfix" />
      </div>
    )
  }

  handleAddMembers() {
    const data = this.props.data
    const users = _.map(_.filter(data.add_members.items_selected, { type: 'user' }), 'value.id')
    const phone_numbers = _.map(_.filter(data.add_members.items_selected, { type: 'phone_number' }), 'value')
    const emails = _.map(_.filter(data.add_members.items_selected, { type: 'email' }), 'value')
    AppStore.data.adding_users = true
    delete AppStore.data.add_users_error
    AppStore.emitChange()
    AppDispatcher.dispatch({
      action: 'add-users',
      room: data.current_room.id,
      users,
      emails,
      phone_numbers,
      user: data.user
    })
  }

  render() {
    // Data
    const data = this.props.data
    const current_room = data.current_room
    let file_viewer
    if (current_room && current_room.viewer) {
      file_viewer = (
        <FileViewer
          data={data}
          closeFileViewer={this.closeFileViewer}
        />
      )
    }
    let users_select_options = []
    // Get users selected
    const users_selected = []
    let users_selected_ids = []
    if (data.add_members && data.add_members.items_selected) {
      const items_selected = data.add_members.items_selected
      items_selected.forEach((item) => {
        users_selected.push(item)
      })
      // Contacts available
      users_selected_ids = _.map(users_selected, item => item.value.id)
    }
    // Search users
    if (data.add_members && data.add_members.users_found) {
      data.add_members.users_found.forEach((user) => {
        if (user) {
          if (user.id !== data.user.id && users_selected_ids && users_selected_ids.indexOf(user.id) === -1 && users_select_options.indexOf(user.id) === -1) {
            users_select_options.push({
              value: user,
              label: user.first_name ? user.first_name : user.phone_number,
              type: 'user'
            })
          }
        }
      })
    }
    // Filter our current room members
    if (data.current_room) {
      const room_users_ids = _.map(data.current_room.users, 'id')
      users_select_options = users_select_options.filter((user) => {
        if (room_users_ids.indexOf(user.value.id) === -1)
          return user
      })
    }
    let main_content = (
      <MainContent
        data={data}
        getPreviousMessages={this.getPreviousMessages.bind(this)}
        handleMessageTyping={this.handleMessageTyping.bind(this)}
        handleContactFilter={this.handleContactFilter.bind(this)}
        handleContactFilterNav={this.handleContactFilterNav.bind(this)}
        filterRooms={this.filterRooms.bind(this)}
        createMessage={this.createMessage.bind(this)}
        showModal={this.showModal}
        hideModal={this.hideModal}
        createRoom={this.createRoom}
        setCurrentRoom={this.setCurrentRoom.bind(this)}
        handleDragEnter={this.handleDragEnter}
        handleDragLeave={this.handleDragLeave}
        uploadFiles={this.uploadFiles.bind(this)}
        showFileViewer={this.showFileViewer}
        setHeadingDate={this.setHeadingDate}
        removeScrollBottom={this.removeScrollBottom}
        showListingViewer={this.showListingViewer}
        changeListingNotification={this.changeListingNotification}
        navListingCarousel={this.navListingCarousel}
        addContactToMessage={this.addContactToMessage}
        hideListingViewer={this.hideListingViewer}
        showModalGallery={this.showModalGallery}
        handleModalGalleryNav={this.handleModalGalleryNav}
        showShareListingModal={controller.listing_viewer.showShareListingModal}
        showAlertModal={controller.alert_modal.showAlertModal}
        hideAlertModal={controller.alert_modal.hideAlertModal}
        setAlertGalleryActiveIndex={controller.alert_modal.setAlertGalleryActiveIndex}
        showDeleteRoomModal={controller.recents.showDeleteRoomModal}
        hideDeleteRoomModal={controller.recents.hideDeleteRoomModal}
        confirmDeleteRoom={controller.recents.confirmDeleteRoom}
        clearRoomSearchText={controller.recents.clearRoomSearchText}
        showNewMessageView={controller.recents.showNewMessageView}
        addUsersToSearchInput={controller.recents.addUsersToSearchInput}
        handleInputChange={controller.recents.handleInputChange}
        handleCancelClick={controller.recents.handleCancelClick}
      />
    )
    if (data.show_create_chat_viewer) {
      // Empty state
      main_content = (
        <div style={S('absolute h-100p w-100p')}>
          <div style={S('h-220 w-360 relative center-block t-30p br-5 text-center')}>
            <div className="empty-state" style={S('w-360 h-220 mb-25 relative br-5 p-25 border-1-solid-e2e2e2')}>
              <img src="/static/images/empty-states/chats.jpg" />
            </div>
            <div style={S('mb-25')}>
              <div style={S('color-929292 font-18')}>Start a Conversation</div>
              <div style={S('color-bebebe font-14')}>Conversations are awesome. Start one now.</div>
            </div>
            <Button onClick={controller.recents.showNewMessageView} style={S('w-200 p-20 color-929292')} bsStyle="default">
              <img style={S('h-18 relative t-1n l-2')} src="/static/images/dashboard/chats/add-chat.svg" />&nbsp;&nbsp;&nbsp;Create Chat
            </Button>
          </div>
        </div>
      )
    }
    let nav_area = (
      <SideBar data={data} />
    )
    if (data.is_mobile && data.user) {
      nav_area = (
        <MobileNav data={data} />
      )
    }
    let main_style = S('minw-1000')
    if (data.is_mobile)
      main_style = S(`w-${window.innerWidth}`)
    let mobile_splash_viewer
    if (data.show_mobile_splash_viewer)
      mobile_splash_viewer = <MobileSplashViewer data={data} />
    let message
    if (data.add_users_error) {
      message = (
        <Alert bsStyle="danger" style={S('text-left')}>
          There was an error with this request.  This user may already be a member of this room.
        </Alert>
      )
    }
    return (
      <div style={main_style}>
        <main>
          { nav_area }
          { main_content }
        </main>
        <audio ref={ref => this.notif_sound = ref} id="notif-sound">
          <source src="/static/audio/ding.mp3" type="audio/mpeg" />
        </audio>
        { file_viewer }
        <Modal dialogClassName={data.is_mobile ? 'modal-mobile' : ''} show={data.show_create_chat_modal} onHide={this.hideModal.bind(this)} onShow={this.onModalShow.bind(this)}>
          <form onSubmit={this.createRoom.bind(this)}>
            <Modal.Header closeButton>
              <Modal.Title>Start a new chat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormControl type="text" inputRef={ref => this.titleInput = ref} placeholder="Chat room title" />
            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle="link" onClick={this.hideModal.bind(this)}>Cancel</Button>
              <Button type="submit" bsStyle="primary">Start chat</Button>
            </Modal.Footer>
          </form>
        </Modal>
        <Modal dialogClassName={data.is_mobile ? 'modal-mobile' : ''} show={data.show_add_members_modal} onHide={this.hideModal}>
          <Modal.Header closeButton style={S('h-70 bc-f3f3f3')}>
            <Modal.Title style={S('font-36')} className="din">Add Members</Modal.Title>
          </Modal.Header>
          <Modal.Body style={S('h-70')}>
            <div className="create-item__user-select">
              <SelectContainer inputChange={this.inputChange.bind(this)}>
                <Select
                  ref={ref => this.myselect = ref}
                  autofocus
                  autosize
                  name="users"
                  options={users_select_options}
                  placeholder="Enter name, email or phone"
                  value={users_selected || null}
                  multi
                  noResultsText={'No users found'}
                  style={S('border-none mt-3')}
                  onInputChange={this.handleInputChange.bind(this)}
                  onChange={this.handleChange.bind(this)}
                  valueRenderer={this.handleValueRenderer.bind(this)}
                  optionRenderer={this.handleOptionRenderer.bind(this)}
                />
              </SelectContainer>
            </div>
            <div className="clearfix" />
          </Modal.Body>
          <Modal.Footer>
            { message }
            <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
            <Button className={data.adding_users ? 'disabled' : ''} bsStyle="primary" onClick={this.handleAddMembers.bind(this)}>
              { data.adding_users ? 'Adding users...' : 'Add' }
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal dialogClassName={data.is_mobile ? 'modal-mobile modal-alert-saved' : 'modal-alert-saved'} show={data.show_room_saved_message} onHide={this.hideModal.bind(this)}>
          <div className="din" style={S('text-center font-60 color-fff')}>
            <div style={S('bg-2196f3 w-165 h-165 br-100 center-block pt-35')}>
              <i className="fa fa-check" style={S('h-70 mt-20')} />
            </div>
            <span style={{ textShadow: '0 2px 6px rgba(0, 0, 0, 0.2)' }}>Room Saved!</span>
          </div>
        </Modal>
        { mobile_splash_viewer }
      </div>
    )
  }
}

// PropTypes
Dashboard.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object.isRequired
}
