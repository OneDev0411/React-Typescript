// MessagesList.js
import React, { Component } from 'react'
import S from 'shorti'
import Loading from '../../../../Partials/Loading'
import { Tooltip, OverlayTrigger, Modal, Button } from 'react-bootstrap'
import config from '../../../../../../config/public'
import helpers from '../../../../../utils/helpers'

// Partials
import MessageItem from './MessageItem'

// Modules
import AddContactsModule from '../../Modules/AddContacts'

export default class MessagesList extends Component {

  componentDidMount() {
    if (typeof window !== 'undefined') {
      const clipboard = require('clipboard')
      new clipboard('.copy-link')
    }
    this.scrollBottom()
  }

  componentDidUpdate() {
    const data = this.props.data
    if (data.scroll_bottom) {
      this.scrollBottom()
      this.props.removeScrollBottom()
    }
  }

  scrollBottom() {
    const messages_scroll_area = this.refs.messages_scroll_area
    if (messages_scroll_area) {
      setTimeout(() => {
        messages_scroll_area.scrollTop = messages_scroll_area.scrollHeight
      }, 100)
    }
  }

  getMessagePositions() {
    const data = this.props.data
    const messages = data.messages
    if (!messages)
      return false
    const heading_objects = []
    messages.forEach((message, i) => {
      const message_element = this.refs['message-' + i]
      const message_created = message.created_at.toString().split('.')
      const rect = message_element.getBoundingClientRect()
      const heading_object = {
        top: rect.top,
        date: message_created[0]
      }
      heading_objects.push(heading_object)
    })
    return heading_objects
  }

  getLockedHeadingDate() {
    const heading_objects = this.getMessagePositions()
    const arr_sorted = heading_objects.sort((a, b) => {
      return a.top - b.top
    })
    const sorted_under_zero = arr_sorted.filter(message => {
      return message.top < 60
    })
    if (!sorted_under_zero || !sorted_under_zero[sorted_under_zero.length - 1])
      return false
    const locked_heading_date = sorted_under_zero[sorted_under_zero.length - 1].date
    // Testing
    // const time_created = helpers.friendlyDate(locked_heading_date)
    // const fixed_heading_date = `${ time_created.month } ${ time_created.date }, ${ time_created.year }`
    this.props.setHeadingDate(locked_heading_date)
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
    this.getLockedHeadingDate()
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

    if (data.messages_loading) {
      return (
        <div style={ S('relative') }>
          <Loading />
        </div>
      )
    }

    if (!data.messages) {
      return (
        <div style={ S('relative') }>
          <Loading />
        </div>
      )
    }

    // Messages
    const messages = data.messages
    let message_date
    const todays_date = helpers.getYMD()
    let prev_message_date
    let heading_style = {
      ...S('bg-f9f9f9 p-5 pl-10 h-26 font-12 mb-5 br-3 color-acacac mb-10'),
      textTransform: 'uppercase'
    }
    const messages_list_items = messages.map((message, i) => {
      let heading
      let heading_date_area
      let new_date = false
      const created_at = message.created_at.toString().split('.')
      const message_date_obj = helpers.friendlyDate(created_at[0])
      message_date = helpers.getYMD(created_at[0] * 1000)
      if (!prev_message_date || prev_message_date && prev_message_date !== message_date) {
        // If not first heading add margin-top
        if (i) {
          heading_style = {
            ...heading_style,
            ...S('mt-15')
          }
        }
        heading_date_area = (
          <span>{ `${message_date_obj.day}, ${message_date_obj.month} ${message_date_obj.date}, ${message_date_obj.year}` }</span>
        )
        if (todays_date === message_date) {
          heading_date_area = (
            <span>{ 'Today' }</span>
          )
        }

        heading = (
          <div className="message-heading" style={ heading_style }>{ heading_date_area }</div>
        )
        new_date = true
      }
      prev_message_date = message_date
      return (
        <li ref={ 'message-' + i} key={ 'message-' + message.id + '-' + i } style={ S('pb-10') }>
          { heading }
          <MessageItem
            i={ i }
            data={ data }
            message={ message }
            showFileViewer={ this.props.showFileViewer }
            new_date={ new_date }
          />
        </li>
      )
    })

    const btn_action_style = S('w-40 h-40 ml-6 pointer absolute p-0 t-15 r-8 br-100 bc-ddd bw-1 solid')
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
        <div className="text-center" style={ S('relative h-80 pt-40') }>
          Loading previous messages...
        </div>
      )
    }

    // Styles
    const messages_scroll_area = {
      ...S('pl-20 pr-20 mt-20 relative'),
      overflow: messages_overflow,
      height: window.innerHeight - 115,
      opacity: messages_opacity
    }
    const fixed_date_obj = helpers.friendlyDate(data.heading_date)
    const fixed_heading_date = `${fixed_date_obj.day}, ${fixed_date_obj.month} ${fixed_date_obj.date}, ${fixed_date_obj.year}`
    return (
      <div>
        <div style={ S('absolute r-60 t-16') }>
          <div className="input-group">
            <input data-clipboard-text={ invite_link } readOnly onClick={ this.handleInviteLinkClick.bind(this) } className="copy-link form-control pull-right" ref="clipboard_target" id="invite-link" type="text" value={ invite_link } style={ S('h-37 w-150') } />
            <span className="input-group-btn">
              <OverlayTrigger rootClose trigger="click" placement="bottom" overlay={ tooltip }>
                <button className="copy-link btn btn-default" type="button" data-clipboard-target="#invite-link" style={ S('h-37') }>
                  <img src="/images/dashboard/icons/clippy.svg" width="13" alt="Copy to clipboard" />
                </button>
              </OverlayTrigger>
            </span>
          </div>
        </div>
        <button onClick={ this.props.showModal.bind(this, 'invite-user') } type="button" className="btn btn-default invite-user__btn" style={ btn_action_style } >
          <img style={ S('ml-1n mt-1n') } src="/images/dashboard/icons/invite-user.svg"/>
        </button>
        <h3 style={ S('mt-0 ml-20 mr-50') }>{ current_room.title }</h3>
        <div className="heading-fixed" style={ S('absolute w-98p z-100 t-60 pl-20 pr-5 pb-0 bg-fff') }>
          <div className="message-heading" style={ { ...heading_style, ...S('m-0') } }>{ fixed_heading_date }</div>
        </div>
        <div ref="messages_scroll_area" style={ messages_scroll_area } onScroll={ this.handleScroll.bind(this) }>
          { loading_previous }
          <ul style={ S('pl-0') }>{ messages_list_items }</ul>
        </div>
        <Modal show={ data.show_contacts_modal } onHide={ this.props.hideModal }>
          <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
           <Modal.Title style={ S('font-14') }>Invite contact <span style={ S('color-929292 fw-400') }>(use any email or any phone number)</span></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddContactsModule
              data={ data }
              module_type="room"
            />
          </Modal.Body>
          <Modal.Footer style={ { border: 'none' } }>
            <Button bsStyle="link" onClick={ this.props.hideModal }>Cancel</Button>
            <Button onClick={ this.props.addContactsToRoom.bind(this) } style={ S('h-30 pt-5 pl-30 pr-30') } className={ data.adding_contacts ? 'disabled' : '' } type="submit" bsStyle="primary">
              { data.adding_contacts ? 'Saving...' : 'Save' }
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

// PropTypes
MessagesList.propTypes = {
  data: React.PropTypes.object,
  getPreviousMessages: React.PropTypes.func.isRequired,
  showModal: React.PropTypes.func.isRequired,
  addContactsToRoom: React.PropTypes.func,
  hideModal: React.PropTypes.func,
  showFileViewer: React.PropTypes.func,
  setHeadingDate: React.PropTypes.func,
  removeScrollBottom: React.PropTypes.func
}