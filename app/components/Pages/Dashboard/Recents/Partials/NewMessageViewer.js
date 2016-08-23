// NewMessageViewer.js
import React, { Component } from 'react'
import S from 'shorti'
import Select from 'react-select'
export default class NewMessageViewer extends Component {
  componentDidMount() {
    this.refs.search_email.refs.input.focus()
  }
  handleChange(rooms_selected) {
    this.props.addRoomsToSearchInput(rooms_selected)
  }
  render() {
    // Data
    const data = this.props.data
    const rooms_select_options = []
    if (data.rooms) {
      const room_users = []
      data.rooms.forEach(room => {
        room_users.push(...room.users)
      })
      room_users.forEach(user => {
        if (user.id !== data.user.id) {
          rooms_select_options.push({
            name: user.first_name + ' ' + user.last_name,
            label: user.first_name + ' ' + user.last_name
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
              options={ rooms_select_options }
              onChange={ this.handleChange.bind(this) }
              placeholder="Enter name, email or phone"
              value={ data.new_message ? data.new_message.rooms_selected : null }
              multi
              noResultsText={ 'No rooms found'}
            />
          </div>
        </div>
      </div>
    )
  }
}

// PropTypes
NewMessageViewer.propTypes = {
  data: React.PropTypes.object,
  addRoomsToSearchInput: React.PropTypes.func
}