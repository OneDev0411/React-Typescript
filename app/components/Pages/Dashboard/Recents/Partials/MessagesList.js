// MessagesList.js
import React, { Component } from 'react'
import S from 'shorti'
import Loading from '../../../../Partials/Loading'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import config from '../../../../../../config/public'
import MessageItem from './MessageItem'

export default class MessagesList extends Component {
  componentDidMount() {
    if (typeof window !== 'undefined') {
      const clipboard = require('clipboard')
      clipboard('.copy-link')
    }
  }

  componentDidUpdate() {
    // TODO: clean this up
    // Scroll to bottom if under 200 px from bottom and not User.Typing
    const messages_scroll_area = this.refs.messages_scroll_area
    if (messages_scroll_area)
      messages_scroll_area.scrollTop = messages_scroll_area.scrollHeight
      // const fromBottom = messages_scroll_area.scrollHeight - messages_scroll_area.scrollTop - parseInt(messages_scroll_area.style.height, 10)
      // if(fromBottom <= 200 && !this.props.data.is_typing)

    // Previous messages loading
    const current_room = this.props.data.current_room
    if (current_room && current_room.loading_previous)
      setTimeout(() => {
        messages_scroll_area.scrollTop = 0
      }, 1)

    // Previous messages loaded
    if (current_room && current_room.viewing_previous)
      this.resetScrollAfterLoad()
  }

  handleInviteLinkClick(e) {
    e.target.select()
  }

  resetScrollAfterLoad() {
    const messages_scroll_area = this.refs.messages_scroll_area
    const current_room = this.props.data.current_room
    const scroll_height = current_room.scroll_height
    if (scroll_height && messages_scroll_area)
      messages_scroll_area.scrollTop = messages_scroll_area.scrollHeight - scroll_height
  }

  handleScroll() {
    if (this.props.data.current_room.showing_all)
      return false
    const messages_scroll_area = this.refs.messages_scroll_area
    if (messages_scroll_area.scrollTop === 0)
      this.props.getPreviousMessages(messages_scroll_area.scrollHeight)
  }

  render() {
    // Data
    const data = this.props.data
    const current_room = data.current_room

    if (data.rooms && !data.rooms.length)
      return <div style={ S('ml-20') }>No messages yet.</div>

    if (data.messages_loading)
      return (
        <div style={ S('relative') }>
          <Loading />
        </div>
      )

    if (!data.messages)
      return (
        <div style={ S('relative') }>
          <Loading />
        </div>
      )

    // Messages
    const messages = data.messages
    const messages_list_items = messages.map((message, i) => {
      return (
        <li key={ message.id } style={ S('pb-10') }>
          <MessageItem i={ i } data={ data } message={ message } />
        </li>
      )
    })

    const invite_user_style = S('w-40 h-40 ml-6 pointer absolute p-0 t-15 r-8 br-100 bc-ddd bw-1 solid')
    const invite_link = config.app.url + '/invite/?room_id=' + data.current_room.id + '&invite_token=' + data.user.access_token

    const tooltip = (
      <Tooltip id="copied-tooltip">
        Copied
      </Tooltip>
    )

    let messages_overflow = 'scroll'
    let messages_opacity = 1
    // Load previous messages
    let loading_previous
    if (data.current_room.loading_previous) {
      messages_overflow = 'hidden'
      messages_opacity = '.7'
      loading_previous = (
        <div className="text-center" style={ S('relative h-60 pt-20') }>
          Loading previous messages...
        </div>
      )
    }

    // Styles
    const messages_scroll_area = {
      ...S('pl-20 pr-20'),
      overflow: messages_overflow,
      height: window.innerHeight - 195,
      opacity: messages_opacity
    }

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
        <button onClick={ this.props.showModal.bind(this, 'invite-user') } type="button" className="btn btn-default invite-user__btn" style={ invite_user_style } >
          <img style={ S('ml-1n mt-1n') } src="/images/svgs/invite-user.svg"/>
        </button>
        <h3 style={ S('mt-0 ml-20 mr-50') }>{ current_room.title }</h3>
        <div ref="messages_scroll_area" style={ messages_scroll_area } onScroll={ this.handleScroll.bind(this) }>
          { loading_previous }
          <ul style={ S('pl-0') }>{ messages_list_items }</ul>
        </div>
      </div>
    )
  }
}

// PropTypes
MessagesList.propTypes = {
  data: React.PropTypes.object.isRequired,
  getPreviousMessages: React.PropTypes.func.isRequired,
  showModal: React.PropTypes.func.isRequired
}