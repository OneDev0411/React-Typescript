// RoomsList.js
import React, { Component } from 'react'
import S from 'shorti'
import Loading from '../../../Partials/Loading'
import ProfileImage from './ProfileImage'
import helpers from '../../../../utils/helpers'

export default class RoomsList extends Component {

  handleClick(i){
    const rooms = this.props.data.rooms
    const room = rooms[i]
    this.props.getMessages(room)
  }

  render(){
    
    const data = this.props.data
    const current_room = data.current_room

    if(data.rooms && !data.rooms.length){
      return <div style={ S('w-100p ml-40 mt-20') }>No rooms yet.</div>
    }

    let rooms_list = <Loading />

    if(data.rooms){
      let rooms = data.rooms
      rooms_list = rooms.map((room, i) => {
        let profile_image_url
        if(room.latest_message.author)
          profile_image_url = room.latest_message.author.profile_image_url

        let list_style = { ...S('pointer pt-10 pb-10 pl-10 pr-30'), borderBottom: '1px solid #e7e4e3' }
        if(current_room && current_room.id == room.id){
          list_style = { ...list_style, ...S('bg-f0f0f0') }
        }
        
        const latest_created = room.latest_message.created_at.toString().split('.')
        const time_created = helpers.timeConverter(latest_created[0])

        return (
          <li style={ list_style } key={ room.id } onClick={ this.handleClick.bind(this, i) }>
            <div style={ S('relative') }>
              <ProfileImage data={ data } profile_image_url={ profile_image_url }/>
              <div className="pull-left" style={ S('ml-50 w-90p') }>
                <div className="pull-left" style={ S('w-65p') }>
                  <b>{ room.title.substring(0, 50) }{ room.title.length > 50 ? '...': '' }</b>
                </div>
                <div className="pull-right text-right" style={ S('color-ccc w-35p') } >
                  { time_created.month } { time_created.date }, { time_created.time_friendly }
                </div>
                <div className="clearfix"></div>
                <div>{ room.latest_message.comment.substring(0, 50) }{ room.latest_message.comment.length > 50 ? '...': '' }</div>
              </div>
              <div className="clearfix"></div>
            </div>
          </li>
        )
      })
    }

    return (
      <ul style={ S('pl-0') }>{ rooms_list }</ul>
    )
  }
}

// PropTypes
RoomsList.propTypes = {
  data: React.PropTypes.object.isRequired
}