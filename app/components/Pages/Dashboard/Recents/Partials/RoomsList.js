// RoomsList.js
import React, { Component } from 'react'
import S from 'shorti'
import ProfileImage from '../../Partials/ProfileImage'
import helpers from '../../../../../utils/helpers'
import _ from 'lodash'
export default class RoomsList extends Component {
  handleClick(id) {
    const data = this.props.data
    const rooms = data.rooms
    const current_room = _.find(rooms, { id })
    this.props.setCurrentRoom(current_room)
  }
  roomHasNotifications(room_id) {
    let result = false
    const data = this.props.data
    if (!data.notifications)
      return false
    const summaries = data.notifications.summary.room_notification_summaries
    if (!summaries)
      return false
    summaries.forEach(summary => {
      if (summary.room_id === room_id)
        result = true
    })
    return result
  }
  render() {
    const data = this.props.data
    let rooms = data.rooms
    // Sort by updates
    if (rooms) {
      rooms = _.sortBy(rooms, room => {
        if (!room.latest_message && room.messages)
          room.latest_message = room.messages[0]
        if (room.latest_message)
          return -room.latest_message.updated_at
      })
    }
    const current_room = data.current_room
    if (rooms && !rooms.length)
      return <div style={ S('ml-20 mt-20') }>No rooms yet.</div>

    const loading_style = {
      ...S('absolute w-100p h-100p bg-url(/images/loading-states/rooms.svg)'),
      backgroundRepeat: 'repeat-y'
    }
    let rooms_list = <div style={ loading_style } />
    if (data.is_filtering)
      rooms = data.filtered_rooms
    if (rooms) {
      rooms_list = rooms.map(room => {
        // Profile image
        let author
        let profile_image_div
        let list_style = S('pointer pt-10 pb-10 pl-10 pr-17 relative border-bottom-1-solid-e7e4e3')
        if (current_room && current_room.id === room.id)
          list_style = { ...list_style, ...S('bg-f5fafe') }
        if (!room.latest_message) {
          list_style = { ...list_style, ...S('h-60') }
          const time_updated = helpers.friendlyDate(room.updated_at)
          let room_owner = room.owner
          // One to one
          if (!room_owner) {
            const not_current_user = room.users.filter(room_user => {
              if (room_user.id !== data.user.id)
                return true
            })
            room_owner = not_current_user[0]
          }
          return (
            <li className="room-list__item" style={ list_style } key={ room.id } onClick={ this.handleClick.bind(this, room.id) }>
              <div style={ S('relative') }>
                <ProfileImage data={ data } user={ room_owner }/>
                <div className="pull-left" style={ S('ml-50 w-90p') }>
                  <div className="room-list__item__title pull-left" style={ S('w-60p') }>
                    <b>{ room.title }</b>
                  </div>
                </div>
                <div className="text-right" style={ S('color-ccc w-50p absolute r-10n font-13') } >
                  { time_updated.month } { time_updated.date }, { time_updated.time_friendly }
                </div>
                <div className="clearfix"></div>
              </div>
              <div className="clearfix"></div>
            </li>
          )
        }
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
        // List users
        const users = room.users
        const first_names = _.map(users, 'first_name')
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
            <div className="room-list__item__message" style={ S('w-90p color-808080') }>{ author_name }{ room.latest_message.comment.substring(0, 50) }{ room.latest_message.comment.length > 50 ? '...' : '' }</div>
          )
        }

        if (room.latest_message.image_url) {
          comment = (
            <div style={ S('color-808080') }>{ author_name }Uploaded a file</div>
          )
        }

        // Notifications
        let notification
        if (data.notifications) {
          const hasNotification = this.roomHasNotifications(room.id)
          if (hasNotification) {
            notification = (
              <div style={ S('absolute r-15 w-0 h-0') }>
                <i className="fa fa-circle" style={ S('font-8 color-3388FF z-10') }></i>
              </div>
            )
          }
        }
        return (
          <li className="room-list__item" style={ list_style } key={ room.id } onClick={ this.handleClick.bind(this, room.id) }>
            <div style={ S('relative') }>
              { profile_image_div }
              <div className="pull-left" style={ S('ml-50 w-90p') }>
                <div className="room-list__item__title pull-left" style={ S('w-60p') }>
                  <b>{ room.title }</b>
                </div>
                <div className="text-right" style={ S('color-ccc w-50p absolute r-10n font-13') } >
                  { time_created.month } { time_created.date }, { time_created.time_friendly }
                  &nbsp;
                  { notification }
                </div>
                <div className="clearfix"></div>
                <div className="room-list__item__names" style={ S('color-aaaaaa w-74p relative t-3n') }>
                  { first_name_list }
                </div>
                { comment }
              </div>
              <div className="clearfix"></div>
            </div>
          </li>
        )
      })
    }
    const rooms_scroll_area = {
      ...S('mt-5'),
      overflowY: 'scroll',
      overflowX: 'hidden',
      height: window.innerHeight - 70
    }
    let list_style = S('pl-0')
    if (data.is_mobile) {
      list_style = {
        ...list_style,
        ...S('mb-70')
      }
    }
    return (
      <div>
        <div className="touch-scroll" style={ rooms_scroll_area }>
          <ul style={ list_style }>{ rooms_list }</ul>
        </div>
      </div>
    )
  }
}
RoomsList.propTypes = {
  setCurrentRoom: React.PropTypes.func.isRequired,
  data: React.PropTypes.object
}