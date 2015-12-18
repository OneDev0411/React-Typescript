// MessagesList.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import S from 'shorti'
import Loading from '../../../Partials/Loading'
import ProfileImage from './ProfileImage'
import helpers from '../../../../utils/helpers'
import emojify from 'emojify.js'
import linkifyString from 'linkifyjs/string'
import { Input, Tooltip, OverlayTrigger } from 'react-bootstrap'
import config from '../../../../../config/public'

emojify.setConfig({
  img_dir: '/images/emoji'
})

export default class MessagesList extends Component {

  handleInviteLinkClick(e){
    e.target.select()
  }

  componentDidMount(){
    if(typeof window !=='undefined')
      var clipboard = require('clipboard')
      new clipboard('.copy-link')
  }

  componentDidUpdate(){
    var messages_scroll_area = ReactDOM.findDOMNode(this.refs.messages_scroll_area)
    if(messages_scroll_area)
      messages_scroll_area.scrollTop = messages_scroll_area.scrollHeight
  }

  render(){
    
    // Data
    const data = this.props.data
    const current_room = data.current_room

    if(data.rooms && !data.rooms.length){
      return <div style={ S('ml-20') }>No messages yet.</div>
    }

    if(data.messages_loading){
      return (
        <div style={ S('relative') }>
          <Loading />
        </div>
      )
    }

    if(!data.messages){
      
      return (
        <div style={ S('relative') }>
          <Loading />
        </div>
      )

    } else {

      let messages = data.messages
      let profile_image_url
      let first_name = ''
      let last_user

      messages = messages.map((message) => {
        
        // Profile image
        let profile_image_url
        let profile_image_div
        if(message.author){
          profile_image_url = message.author.profile_image_url
          profile_image_div = (
            <ProfileImage data={ data } profile_image_url={ profile_image_url }/>
          )
        }
        if(!message.author)
          profile_image_div = (
            <div style={ S('absolute') }>
              <img src="/images/dashboard/rebot.png" style={ S('w-30') } />
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
        if(message.recommendation && message.recommendation.listing && message.recommendation.listing.cover_image_url){
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

        // Get latest user and group
        if(message.author){
          if(last_user === message.author.id){
            return (
              <li style={ S('pb-12 pr-30') } key={ message.id }>
                <div className="pull-left" style={ S('ml-50') }>
                  <div className={ message_class_name } dangerouslySetInnerHTML={ { __html: message_text } }></div>
                </div>
                <div className="clearfix"></div>
              </li>
            )
          }
          
          last_user = message.author.id
        }

        return (
          <li style={ S('pb-12 pr-30') } key={ message.id }>
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
          </li>
        )
      })
  
      // Styles
      const messages_scroll_area = {
        ...S('pl-20 pr-20'),
        overflow: 'scroll',
        height: window.innerHeight - 178
      }

      const invite_user_style = S('w-40 h-40 ml-6 pointer absolute p-0 t-15 r-8 br-100 bc-ddd bw-1 solid')
      const invite_link = config.app.url + '/invite/?room_id=' + data.current_room.id + '&invite_token=' + data.user.access_token

      const tooltip = (
        <Tooltip id="copied-tooltip">
          Copied
        </Tooltip>
      )
      return (
        <div>
          <div style={ S('absolute r-60 t-16') }>
            <div className="input-group">
              <input data-clipboard-text={ invite_link } readOnly onClick={ this.handleInviteLinkClick.bind(this) } className="copy-link form-control pull-right" ref="clipboard_target" id="invite-link" type="text" value={ invite_link } style={ S('h-37 w-150') } />
              <span className="input-group-btn">
                <OverlayTrigger rootClose trigger="click" placement="bottom" overlay={ tooltip }>
                  <button className="copy-link btn btn-default" type="button" data-clipboard-target="#invite-link" style={ S('h-37') }>
                    <img src="/images/svgs/clippy.svg" width="13" alt="Copy to clipboard" />
                  </button>
                </OverlayTrigger>
              </span>
            </div>
          </div>
          <button onClick={ this.props.showModal.bind(this,'invite-user') } type="button" className="btn btn-default invite-user__btn" style={ invite_user_style } >
            <img style={ S('ml-1n mt-1n') } src="/images/svgs/invite-user.svg"/>
          </button>
          <h3 style={ S('mt-0 ml-20 mr-50') }>{ current_room.title }</h3>
          <div ref="messages_scroll_area" style={ messages_scroll_area }>
            <ul style={ S('pl-0') }>{ messages }</ul>
          </div>
        </div>
      )
    }
  }
}

// PropTypes
MessagesList.propTypes = {
  data: React.PropTypes.object.isRequired
}