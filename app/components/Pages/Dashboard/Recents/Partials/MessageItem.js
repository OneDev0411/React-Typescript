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
  render() {
    // Data
    const data = this.props.data
    const messages = data.messages
    const message = this.props.message
    const i = this.props.i
    let first_name

    // Profile image
    let author
    let profile_image_div
    if (message.author) {
      author = message.author
      profile_image_div = (
        <ProfileImage user={ author }/>
      )
    }
    // Rebot
    if (!message.author) {
      profile_image_div = (
        <div style={ S('absolute w-35') }>
          <img className="center-block" src="/images/dashboard/rebot@2x.png" style={ S('w-30') } />
        </div>
      )
    }

    // First name
    if (message.author)
      first_name = message.author.first_name

    // Message time
    const message_created = message.created_at.toString().split('.')
    const time_created = helpers.friendlyDate(message_created[0])

    // Message image
    let message_image
    if (message.image_url) {
      const file_url = message.image_url
      let message_thumb = <img src={ file_url } style={ S('maxw-400') }/>
      if (file_url.toLowerCase().indexOf('.png') === -1 && file_url.toLowerCase().indexOf('.jpg') === -1 && file_url.toLowerCase().indexOf('.gif') === -1) {
        const ext = file_url.split('.').pop().substr(0, 3)
        message_thumb = (
          <div style={ S('w-100 text-center') }>
            <i style={ S('font-60') } className="text-primary fa fa-file-o"></i>
            <br />
            { ext }
          </div>
        )
      }
      message_image = (
        <div onClick={ this.props.showFileViewer.bind(this, file_url) } style={ S('pointer') }>
          { message_thumb }
        </div>
      )
    }

    // Listing
    if (message.recommendation && message.recommendation.listing && message.recommendation.listing.cover_image_url) {
      const cover_image_url = message.recommendation.listing.cover_image_url
      message_image = (
        <div>
          <img src={ cover_image_url } style={ S('maxw-400') }/>
        </div>
      )
    }

    // Fade in
    let message_class_name
    if (message.fade_in)
      message_class_name = 'fade-in'

    let message_text = message.comment
    if (!message_image && message.comment)
      message_text = emojify.replace(linkifyString(message.comment))

    // Get latest author and group
    if (message.author) {
      if (messages[i - 1] && messages[i - 1].author && messages[i - 1].author.id === message.author.id) {
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

// PropTypes
MessageItem.propTypes = {
  data: React.PropTypes.object,
  message: React.PropTypes.object.isRequired,
  i: React.PropTypes.number.isRequired,
  showFileViewer: React.PropTypes.func
}