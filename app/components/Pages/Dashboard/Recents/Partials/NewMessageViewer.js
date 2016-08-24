// NewMessageViewer.js
import React, { Component } from 'react'
import S from 'shorti'
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
    console.log(data.contacts)
    if (data.contacts) {
      data.contacts.forEach(user => {
        let full_name
        if (user.id !== data.user.id) {
          full_name = user.first_name
          if (user.last_name)
            full_name += full_name + ' ' + user.first_name
          users_select_options.push({
            value: full_name,
            label: full_name
          })
        }
      })
    }
    return (
      <div>
        <div style={ S('h-60 border-bottom-1-solid-e2e6ea') }>
          <h3 style={ S('w-80p mt-0 ml-20 mr-50 pt-15') }>New Message</h3>
        </div>
        <div style={ S('relative w-100p h-50 border-bottom-1-solid-e2e6ea p-10') }>
          <div style={ S('absolute l-10 t-15') }>To:</div>
          <div style={ S('absolute l-35 t-5 w-90p') }>
            <Select
              name="rooms"
              options={ users_select_options }
              onChange={ this.handleChange.bind(this) }
              placeholder="Enter name, email or phone"
              value={ data.new_message ? data.new_message.users_selected : null }
              multi
              noResultsText={ 'No rooms found'}
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