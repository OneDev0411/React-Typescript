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
import ProfileImage from '../../Partials/ProfileImage'
export default class NewMessageViewer extends Component {
  inputChange(e) {
    // Enter clicked
    const data = this.props.data
    if (e.which === 13) {
      if (data.new_message && data.new_message.items_selected && data.new_message.search_value) {
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
    let display_name
    if (item.type === 'contact') {
      const user = item.value.contact_user
      if (getResizeAvatarUrl(user.profile_image_url))
        profile_image = <div style={ S(`pull-left bg-url(${getResizeAvatarUrl(user.profile_image_url)}?w=160) w-26 h-26 bg-cover bg-center`) }/>
      display_name = (
        <div style={ S(`pull-left mt-4 ml-10 mr-5`) }>
          { item.value.contact_user.first_name }
        </div>
      )
    } else {
      display_name = (
        <div style={ S(`pull-left mt-4 ml-10 mr-5`) }>{ item.value }</div>
      )
    }
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
    let display_value
    if (item.type === 'contact') {
      const user = item.value.contact_user
      profile_image = (
        <ProfileImage data={ data } user={ user }/>
      )
      display_value = item.value.contact_user.first_name
    } else
      display_value = item.value
    return (
      <div style={ S('relative h-54') }>
        <div style={ S('mt-10') }>{ profile_image }</div>
        <div style={ S('pull-left mt-10 ml-60 mr-5') }>{ display_value }</div>
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
    if (data.new_message && data.new_message.items_selected) {
      const items_selected = data.new_message.items_selected
      items_selected.forEach(item => {
        if (item.type === 'room') {
          // Parse users
          item.value.forEach(user => {
            if (user.id !== data.user.id) {
              users_selected.push({
                label: user.first_name,
                value: user,
                type: 'user'
              })
            }
          })
        } else
          users_selected.push(item)
      })
    }
    if (data.contacts) {
      data.contacts.forEach(user => {
        let full_name
        if (user.id !== data.user.id && user.first_name) {
          full_name = user.first_name
          if (user.last_name)
            full_name += ' ' + user.last_name
          if (!_.find(users_selected, { id: user.id })) {
            users_select_options.push({
              value: user,
              label: full_name,
              type: 'contact'
            })
          }
        }
      })
    }
    // if (data.rooms) {
    //   data.rooms.forEach(room => {
    //     const not_current_user_users = room.users.filter(room_user => {
    //       if (room_user.id !== data.user.id)
    //         return true
    //     })
    //     let first_name_list = ''
    //     not_current_user_users.forEach((user, _i) => {
    //       first_name_list += user.first_name
    //       if (_i < not_current_user_users.length - 1) first_name_list += ', '
    //     })
    //     users_select_options.push({
    //       value: room.users,
    //       label: first_name_list,
    //       type: 'room'
    //     })
    //   })
    // }
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
      <div style={ S('bg-f6f7f9 h-100p absolute w-100p') }>
        <div style={ S('h-60 border-bottom-1-solid-e2e6ea bg-fff') }>
          <h3 style={ S('w-80p mt-0 ml-20 mr-50 pt-15') }>New Message</h3>
        </div>
        <div style={ S('relative w-100p h-50 p-10 bg-fff border-bottom-1-solid-e2e6ea') }>
          <div style={ S('absolute l-10 t-15') }>To:</div>
          <div className="create-item__user-select" style={ S('absolute l-35 t-5 w-90p z-3') }>
            <SelectContainer inputChange={ this.inputChange.bind(this) }>
              <Select
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