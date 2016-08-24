// NewMessageViewer.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'
import Select from 'react-select'
import CreateMessageArea from './CreateMessageArea'
export default class NewMessageViewer extends Component {
  handleChange(users_selected) {
    this.props.addUsersToSearchInput(users_selected)
  }
  render() {
    // Data
    const data = this.props.data
    const users_select_options = []
    // Get users selected
    const users_selected = []
    if (data.new_message.items_selected) {
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
    return (
      <div>
        <div style={ S('h-60 border-bottom-1-solid-e2e6ea') }>
          <h3 style={ S('w-80p mt-0 ml-20 mr-50 pt-15') }>New Message</h3>
        </div>
        <div style={ S('relative w-100p h-50 p-10') }>
          <div style={ S('absolute l-10 t-15') }>To:</div>
          <div className="new-message__user-select" style={ S('absolute l-35 t-5 w-90p') }>
            <Select
              name="rooms"
              options={ users_select_options }
              onChange={ this.handleChange.bind(this) }
              placeholder="Enter name, email or phone"
              value={ users_selected ? users_selected : null }
              multi
              noResultsText={ 'No rooms found'}
              style={ S('border-none mt-3') }
            />
          </div>
        </div>
        <CreateMessageArea
          data={ data }
          uploadFiles={ this.props.uploadFiles }
          createMessage={ this.props.createMessage }
          addContactToMessage={ this.props.addContactToMessage }
          handleContactFilterNav={ this.props.handleContactFilterNav }
          handleMessageTyping={ this.props.handleMessageTyping }
          handleContactFilter={ this.props.handleContactFilter }
        />
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
  handleContactFilter: React.PropTypes.func
}