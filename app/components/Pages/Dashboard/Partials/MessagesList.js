// MessagesList.js
import React, { Component } from 'react'
import S from 'shorti'
import Loading from '../../../Partials/Loading'
import ProfileImage from './ProfileImage'
import helpers from '../../../../utils/helpers'

export default class MessagesList extends Component {

  render(){
    
    const data = this.props.data
    const current_room = data.current_room

    if(data.rooms && !data.rooms.length){
      return <div style={ S('w-100p ml-40') }>No messages yet.</div>
    }

    if(!data.messages){
      
      return (
        <Loading />
      )

    } else {

      let messages = data.messages
      let profile_image_url
      let first_name = ''
      messages = messages.map((message) => {
        profile_image_url = ''
        if(message.author)
          profile_image_url = message.author.profile_image_url
        if(message.author)
          first_name = message.author.first_name
        const message_created = message.created_at.toString().split('.')
        const time_created = helpers.timeConverter(message_created[0])
        return (
          <li style={ S('pb-12 pr-30') } key={ message.id }>
            <div style={ S('relative') }>
              <ProfileImage data={ data } profile_image_url={ profile_image_url }/>
              <div className="pull-left" style={ S('ml-60') }>
                <div>
                  <b>{ first_name }</b>
                  <span style={ S('color-ccc ml-20') } >
                    { time_created.month } { time_created.date }, { time_created.time_friendly }
                  </span>
                </div>
                <div>{ message.comment }</div>
              </div>
              <div className="clearfix"></div>
            </div>
          </li>
        )
      })

      const messages_scroll_area = {
        ...S('pl-20 pr-20'),
        overflow: 'scroll',
        height: window.innerHeight - 168
      }

      return (
        <div style={ messages_scroll_area }>
          <h3 style={ S('mt-0') }>{ current_room.title }</h3>
          <ul style={ S('pl-10') }>{ messages }</ul>
        </div>
      )
    }
  }
}

// PropTypes
MessagesList.propTypes = {
  data: React.PropTypes.object.isRequired
}