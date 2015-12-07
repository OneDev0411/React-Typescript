// RoomsList.js
import React, { Component } from 'react'
import S from 'shorti'
import Loading from '../../../Partials/Loading'
import ProfileImage from './ProfileImage'

export default class RoomsList extends Component {

  handleClick(i){
    const rooms = this.props.data.rooms
    const room = rooms[i]
    this.props.getMessages(room)
  }

  render(){
    
    const data = this.props.data
    const current_room = data.current_room

    let rooms_list = <Loading />

    if(data.rooms){
      let rooms = data.rooms
      rooms_list = rooms.map((room, i) => {
        let profile_image_url
        if(room.latest_message.author)
          profile_image_url = room.latest_message.author.profile_image_url

        let list_style = S('pointer pt-10 pb-10 pl-10 pr-30')
        if(current_room.id == room.id){
          list_style = { ...list_style, ...S('bg-ededed') }
        }
        return (
          <li style={ list_style } key={ room.id } onClick={ this.handleClick.bind(this, i) }>
            <div style={ S('relative') }>
              <ProfileImage data={ data } profile_image_url={ profile_image_url }/>
              <div className="pull-left" style={ S('ml-50') }>
                <b>{ room.title }</b>
                <div>{ room.latest_message.comment }</div>
              </div>
              <div className="clearfix"></div>
            </div>
          </li>
        )
      })
    }

    return (
      <ul style={ S('pl-0 minw-250') }>{ rooms_list }</ul>
    )
  }

}