// MessagesItem.js
import React, { Component } from 'react'
import ProfileImage from '../../Partials/ProfileImage'
import S from 'shorti'
import helpers from '../../../../../utils/helpers'
import emojify from 'emojify.js'
import linkifyString from 'linkifyjs/string'
emojify.setConfig({
  img_dir: '/images/emoji'
})

export default class MessageItem extends Component {
  
  render(){
    
    // Data
    const data = this.props.data
    const messages = data.messages
    const message = this.props.message
    let i = this.props.i
    let first_name

    // Profile image
    let profile_image_url
    let profile_image_div
    if(message.author){
      profile_image_url = message.author.profile_image_url
      profile_image_div = (
        <ProfileImage data={ data } profile_image_url={ profile_image_url }/>
      )
    }
    // Rebot
    if(!message.author)
      profile_image_div = (
        <div style={ S('absolute w-35') }>
          <img className="center-block" src="/images/dashboard/rebot@2x.png" style={ S('w-30') } />
        </div>
      )

    // First name
    if(message.author)
      first_name = message.author.first_name

    // Message time
    const message_created = message.created_at.toString().split('.')
    const time_created = helpers.timeConverter(message_created[0])

    // Message image
    let message_image
    if(message.image_url)
      message_image = (
        <div>
          <img src={ message.image_url } style={ S('maxw-400') }/>
        </div>
      )

    // Listing
    if(message.recommendation && 
    message.recommendation.listing && 
    message.recommendation.listing.cover_image_url){
      let cover_image_url = message.recommendation.listing.cover_image_url
      message_image = (
        <div>
          <img src={ cover_image_url } style={ S('maxw-400') }/>
        </div>
      )
    }

    // Fade in
    let message_class_name
    if(message.fade_in)
      message_class_name = 'fade-in'

    let message_text = message.comment
    if(!message_image)
      message_text = emojify.replace(linkifyString(message.comment))

    // Get latest author and group
    if(message.author){
      if(messages[i-1] && 
      messages[i-1].author &&
      messages[i-1].author.id === message.author.id){
        return (
          <div style={ S('relative') }>
            <div className="pull-left" style={ S('ml-50') }>
              <div className={ message_class_name } dangerouslySetInnerHTML={ { __html: message_text } }></div>
              { message_image }
            </div>
            <div className="clearfix"></div>
          </div>
        )
      }
    }

    return (
      <div style={ S('relative') }>
        { profile_image_div }
        <div className="pull-left" style={ S('ml-50') }>
          <b>{ first_name || 'Rebot' }</b>
          <span style={ S('color-ccc ml-20') } >
            { time_created.month } { time_created.date }, { time_created.time_friendly }
          </span>
          <div className={ message_class_name } dangerouslySetInnerHTML={ { __html: message_text } }></div>
          { message_image }
        </div>
        <div className="clearfix"></div>
      </div>
    )
  }
}