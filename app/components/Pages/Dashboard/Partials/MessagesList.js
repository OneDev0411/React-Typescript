// MessagesList.js
import React, { Component } from 'react'
import S from 'shorti'
import Loading from '../../../Partials/Loading'
import ProfileImage from './ProfileImage'

export default class MessagesList extends Component {

  render(){
    
    const data = this.props.data
    const current_room = data.current_room

    if(!data.messages){
      
      return (
        <Loading />
      )

    } else {

      let messages = data.messages
      let profile_image_url
      messages = messages.map((message) => {
        profile_image_url = ''
        if(message.author)
          profile_image_url = message.author.profile_image_url

        return (
          <li style={ S('pointer pt-10 pb-10 pr-30') } key={ message.id }>
            <div style={ S('relative') }>
              <ProfileImage data={ data } profile_image_url={ profile_image_url }/>
              <div className="pull-left" style={ S('ml-60') }>
                <div>{ message.comment }</div>
              </div>
              <div className="clearfix"></div>
            </div>
          </li>
        )
      })

      return (
        <div>
          <h3 style={ S('mt-0') }>{ current_room.title }</h3>
          <ul style={ S('pl-0') }>{ messages }</ul>
        </div>
      )
    }
  }

}