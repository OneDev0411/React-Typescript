// MessagesList.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import S from 'shorti'
import Loading from '../../../Partials/Loading'
import ProfileImage from './ProfileImage'
import helpers from '../../../../utils/helpers'

export default class MessagesList extends Component {

  componentDidUpdate(){
    var messages_scroll_area = ReactDOM.findDOMNode(this.refs.messages_scroll_area)
    if(messages_scroll_area)
      messages_scroll_area.scrollTop = messages_scroll_area.scrollHeight;
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
      messages = messages.map((message) => {
        profile_image_url = ''
        if(message.author)
          profile_image_url = message.author.profile_image_url
        if(message.author)
          first_name = message.author.first_name
        const message_created = message.created_at.toString().split('.')
        const time_created = helpers.timeConverter(message_created[0])
        let message_image
        if(message.image_url)
          message_image = (
            <div>
              <img src={ message.image_url } style={ S('maxw-400') }/>
            </div>
          )
        return (
          <li style={ S('pb-12 pr-30') } key={ message.id }>
            <div style={ S('relative') }>
              <ProfileImage data={ data } profile_image_url={ profile_image_url }/>
              <div className="pull-left" style={ S('ml-50') }>
                <b>{ first_name || 'Rebot' }</b>
                <span style={ S('color-ccc ml-20') } >
                  { time_created.month } { time_created.date }, { time_created.time_friendly }
                </span>
                <div>{ message.comment }</div>
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
        height: window.innerHeight - 198
      }

      return (
        <div>
          <button onClick={ this.props.showModal.bind(this,'invite-user') } type="button" className="btn btn-default invite-user__btn" style={ S('w-40 h-40 ml-6 pointer absolute p-0 t-20 r-8 br-100 bc-ddd bw-1 solid') } >
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