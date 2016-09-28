// NewMessageViewer.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'
import Select from 'react-select'
import validator from 'validator'
import CreateMessageArea from './CreateMessageArea'
import MessagesList from './MessagesList'
import SelectContainer from '../../Partials/SelectContainer'
import { getResizeAvatarUrl } from '../../../../../utils/user'
import { getDisplayNameString } from '../../../../../utils/room'
import ProfileImage from '../../Partials/ProfileImage'
import ProfileImageMultiple from '../../Partials/ProfileImageMultiple'
export default class NewMessageViewer extends Component {
  inputChange(e) {
    // Enter clicked
    const data = this.props.data
    if (e.which === 13) {
      if (data.new_message && data.new_message.search_value) {
        if (!data.new_message.items_selected)
          data.new_message.items_selected = []
        const search_value = data.new_message.search_value
        // Emails
        if (validator.isEmail(search_value)) {
          data.new_message.items_selected.push({
            email: search_value,
            type: 'email',
            label: search_value,
            value: search_value
          })
          this.props.addUsersToSearchInput(data.new_message.items_selected)
        }
        // Phone numbers
        if (validator.isNumeric(search_value)) {
          data.new_message.items_selected.push({
            email: search_value,
            type: 'phone_number',
            label: search_value,
            value: search_value
          })
          this.props.addUsersToSearchInput(data.new_message.items_selected)
        }
        this.refs.myselect.refs.input.blur()
      }
    }
  }
  handleChange(users_selected) {
    this.props.addUsersToSearchInput(users_selected)
  }
  handleInputChange(value) {
    this.props.handleInputChange(value)
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
      profile_image = <div style={ S(`pull-left bg-url(${getResizeAvatarUrl(profile_image_url)}?w=160) w-26 h-26 bg-cover bg-center`) }/>
    }
    const display_name = (
      <div style={ S(`pull-left mt-4 ml-10 mr-5`) }>
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
    if (item.type === 'user') {
      // Contact
      const user = item.value
      profile_image = (
        <ProfileImage data={ data } user={ user }/>
      )
    } else {
      // Room
      profile_image = (
        <ProfileImageMultiple users={ item.value.users }/>
      )
    }
    return (
      <div style={ S('relative ' + (item.index < 1 ? 'h-74' : 'h-54')) } className={ item.index < 1 ? 'other-users--first' : '' } >
        <div style={ S('mt-10') }>{ profile_image }</div>
        <div style={ S('pull-left mt-10 ml-60 mr-5') }>{ item.label }</div>
        <div className="clearfix"/>
      </div>
    )
  }
  render() {
    // Data
    const data = this.props.data
    const users_select_options = []
    // Get users selected
    const users_selected = []
    let users_selected_ids = []
    if (data.new_message && data.new_message.items_selected) {
      const items_selected = data.new_message.items_selected
      items_selected.forEach(item => {
        users_selected.push(item)
      })
      // Contacts available
      users_selected_ids = _.map(users_selected, item => {
        return item.value.id
      })
    }
    // Rooms available
    if (data.rooms) {
      data.rooms.forEach(room => {
        if (room.users.length > 2) {
          // Test if user in available rooms
          if (users_selected_ids && users_selected_ids.length) {
            const room_user_ids = _.map(room.users, 'id')
            const has_all_users = users_selected_ids.every(id => room_user_ids.indexOf(id) !== -1)
            if (has_all_users && room_user_ids.length - 1 > users_selected_ids.length) {
              users_select_options.push({
                value: room,
                label: getDisplayNameString(room, data.user),
                type: 'room'
              })
            }
          } else {
            users_select_options.push({
              value: room,
              label: getDisplayNameString(room, data.user),
              type: 'room'
            })
          }
        }
      })
    }
    if (data.contacts) {
      data.contacts.forEach(contact => {
        const user = contact.contact_user
        if (user) {
          if (user.id !== data.user.id && users_selected_ids && users_selected_ids.indexOf(user.id) === -1) {
            users_select_options.push({
              value: user,
              label: user.first_name ? user.first_name : contact.phone_number,
              type: 'user'
            })
          }
        }
      })
    }
    // Search users
    if (data.new_message && data.new_message.users_found) {
      data.new_message.users_found.forEach((user, i) => {
        if (user) {
          if (user.id !== data.user.id && users_selected_ids && users_selected_ids.indexOf(user.id) === -1 && users_select_options.indexOf(user.id) === -1) {
            users_select_options.push({
              value: user,
              label: user.first_name ? user.first_name : user.phone_number,
              type: 'user',
              index: i
            })
          }
        }
      })
    }
    let messages_area
    if (data.current_room) {
      messages_area = (
        <MessagesList
          data={ data }
          getPreviousMessages={ this.props.getPreviousMessages }
          showModal={ this.props.showModal.bind(this) }
          addContactsToRoom={ this.props.addContactsToRoom }
          hideModal={ this.props.hideModal.bind(this) }
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
    }
    let create_message_area
    if (users_selected && users_selected.length) {
      create_message_area = (
        <CreateMessageArea
          data={ data }
          uploadFiles={ this.props.uploadFiles }
          createMessage={ this.props.createMessage }
          addContactToMessage={ this.props.addContactToMessage }
          handleContactFilterNav={ this.props.handleContactFilterNav }
          handleMessageTyping={ this.props.handleMessageTyping }
          handleContactFilter={ this.props.handleContactFilter }
        />
      )
    }
    return (
      <div style={ S('h-100p absolute w-100p' + (!data.current_room ? ' bg-f6f7f9' : '')) }>
        <div style={ S('h-60 border-bottom-1-solid-e2e6ea bg-fff') }>
          <h3 style={ S('w-80p mt-0 ml-20 mr-50 pt-15') }>New Message</h3>
        </div>
        <div style={ S('relative w-100p h-50 p-10 bg-fff border-bottom-1-solid-e2e6ea') }>
          <div style={ S('absolute l-10 t-15') }>To:</div>
          <div className="create-item__user-select" style={ S('absolute l-35 t-5 w-90p z-3') }>
            <SelectContainer inputChange={ this.inputChange.bind(this) }>
              <Select
                ref="myselect"
                autofocus
                name="users"
                options={ users_select_options }
                placeholder="Enter name, email or phone"
                value={ users_selected ? users_selected : null }
                multi
                noResultsText={ 'No users found'}
                style={ S('border-none mt-3') }
                onInputChange={ this.handleInputChange.bind(this) }
                onChange={ this.handleChange.bind(this) }
                valueRenderer={ this.handleValueRenderer.bind(this) }
                optionRenderer={ this.handleOptionRenderer.bind(this) }
              />
            </SelectContainer>
          </div>
        </div>
        { messages_area }
        { create_message_area }
      </div>
    )
  }
}

// PropTypes
NewMessageViewer.propTypes = {
  data: React.PropTypes.object,
  addUsersToSearchInput: React.PropTypes.func,
  uploadFiles: React.PropTypes.func,
  createMessage: React.PropTypes.func,
  addContactToMessage: React.PropTypes.func,
  handleContactFilterNav: React.PropTypes.func,
  handleMessageTyping: React.PropTypes.func,
  handleContactFilter: React.PropTypes.func,
  getPreviousMessages: React.PropTypes.func,
  showModal: React.PropTypes.func,
  addContactsToRoom: React.PropTypes.func,
  hideModal: React.PropTypes.func,
  showFileViewer: React.PropTypes.func,
  setHeadingDate: React.PropTypes.func,
  removeScrollBottom: React.PropTypes.func,
  showListingViewer: React.PropTypes.func,
  changeListingNotification: React.PropTypes.func,
  showAlertModal: React.PropTypes.func,
  hideAlertModal: React.PropTypes.func,
  showDeleteRoomModal: React.PropTypes.func,
  hideDeleteRoomModal: React.PropTypes.func,
  confirmDeleteRoom: React.PropTypes.func,
  setAlertGalleryActiveIndex: React.PropTypes.func,
  handleInputChange: React.PropTypes.func
}