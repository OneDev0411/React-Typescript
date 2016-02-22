// RoomsList.js
import React, { Component } from 'react'
import S from 'shorti'
import Loading from '../../../../Partials/Loading'
import ProfileImage from '../../Partials/ProfileImage'
import helpers from '../../../../../utils/helpers'
import _ from 'lodash'

export default class RoomsList extends Component {

  handleClick(i) {
    const data = this.props.data
    let rooms = data.rooms
    // Sort by updates
    if (rooms) {
      rooms = _.sortBy(rooms, room => {
        return -room.latest_message.updated_at
      })
    }
    const filtered_rooms = data.filtered_rooms
    let room = rooms[i]
    if (filtered_rooms)
      room = filtered_rooms[i]
    this.props.setCurrentRoom(room)
  }

  roomHasNotifications(room_id) {
    let result = false
    const summaries = this.props.data.notifications.summary.room_notification_summaries
    if (!summaries)
      return false
    summaries.forEach(summary => {
      if (summary.room_id === room_id)
        result = true
    })
    return result
  }

  render() {
    // Data
    const data = this.props.data
    let rooms = data.rooms
    // Sort by updates
    if (rooms) {
      rooms = _.sortBy(rooms, room => {
        return -room.latest_message.updated_at
      })
    }
    const current_room = data.current_room
    if (rooms && !rooms.length)
      return <div style={ S('ml-20 mt-20') }>No rooms yet.</div>

    let rooms_list = <Loading />

    if (data.is_filtering)
      rooms = data.filtered_rooms

    if (rooms) {
      rooms_list = rooms.map((room, i) => {
        // Profile image
        let author
        let profile_image_div
        if (room.latest_message.author) {
          author = room.latest_message.author
          profile_image_div = (
            <ProfileImage data={ data } user={ author }/>
          )
        }
        if (!room.latest_message.author) {
          profile_image_div = (
            <div style={ S('absolute w-35') }>
              <img className="center-block" src="/images/dashboard/rebot@2x.png" style={ S('w-30') } />
            </div>
          )
        }
        let list_style = { ...S('pointer pt-10 pb-10 pl-10 pr-37'), borderBottom: '1px solid #e7e4e3' }
        if (current_room && current_room.id === room.id)
          list_style = { ...list_style, ...S('bg-f5fafe') }

        // List users
        const users = room.users
        const first_names = _.pluck(users, 'first_name')
        let first_name_list = ''
        first_names.forEach((first_name, _i) => {
          first_name_list += first_name
          if (_i < first_names.length - 1) first_name_list += ', '
        })

        // Time posted
        const latest_created = room.latest_message.created_at.toString().split('.')
        const time_created = helpers.friendlyDate(latest_created[0])
        let author_name
        if (room.latest_message.author)
          author_name = `${room.latest_message.author.first_name} ${room.latest_message.author.last_name}: `
        let comment
        if (room.latest_message.comment) {
          comment = (
            <div style={ S('color-808080') }>{ author_name }{ room.latest_message.comment.substring(0, 50) }{ room.latest_message.comment.length > 50 ? '...' : '' }</div>
          )
        }

        if (room.latest_message.image_url) {
          comment = (
            <div style={ S('color-808080') }>{ author_name }Uploaded a file</div>
          )
        }

        const hasNotification = this.roomHasNotifications(room.id)
        let notification
        if (hasNotification) {
          notification = (
            <i className="fa fa-circle" style={ S('font-8 color-3388FF absolute r-15n') }></i>
          )
        }

        return (
          <li className="room-list__item" style={ list_style } key={ room.id } onClick={ this.handleClick.bind(this, i) }>
            <div style={ S('relative') }>
              { profile_image_div }
              <div className="pull-left" style={ S('ml-50 w-90p') }>
                <div className="pull-left" style={ S('w-60p') }>
                  <b>{ room.title.substring(0, 50) }{ room.title.length > 50 ? '...' : '' }</b>
                </div>
                <div className="text-right" style={ S('color-ccc w-50p absolute r-10n font-13') } >
                  { time_created.month } { time_created.date },<br /> { time_created.time_friendly }
                  &nbsp;
                  { notification }
                </div>
                <div className="clearfix"></div>
                <div style={ S('color-aaaaaa w-74p') }>{ first_name_list }</div>
                { comment }
              </div>
              <div className="clearfix"></div>
            </div>
          </li>
        )
      })
    }

    // Styles
    const rooms_scroll_area = {
      ...S('mt-5'),
      overflow: 'scroll',
      height: window.innerHeight - 70
    }

    return (
      <div>
        <div style={ rooms_scroll_area }>
          <ul style={ S('pl-0') }>{ rooms_list }</ul>
        </div>
      </div>
    )
  }
}

// PropTypes
RoomsList.propTypes = {
  setCurrentRoom: React.PropTypes.func.isRequired,
  data: React.PropTypes.object
}