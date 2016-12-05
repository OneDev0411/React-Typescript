// MessagesItem.js
import React, { Component } from 'react'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import ProfileImage from '../../Partials/ProfileImage'
import S from 'shorti'
import helpers from '../../../../../utils/helpers'
import listing_util from '../../../../../utils/listing'
import emojify from 'emojify.js'
import linkifyString from 'linkifyjs/string'
import _ from 'lodash'
emojify.setConfig({
  img_dir: '/images/emoji'
})

export default class MessageItem extends Component {
  makeMentionBlue(text) {
    const data = this.props.data
    const current_room = data.current_room
    const users = current_room.users
    let filterd_text = text
    users.forEach(user => {
      const full_name = user.first_name + ' ' + user.last_name
      if (text.trim().indexOf(full_name.trim()) !== -1)
        filterd_text = text.replace(new RegExp(full_name, 'g'), '<span class="text-primary">' + user.first_name + '</span>')
    })
    return filterd_text
  }
  showAlertModal(alert_id) {
    const data = this.props.data
    const current_room = data.current_room
    this.props.showAlertModal(alert_id, current_room.id)
  }
  render() {
    const data = this.props.data
    const user = data.user
    const current_room = data.current_room
    const messages = current_room.messages
    const message = this.props.message
    let recommendation
    if (message.recommendation)
      recommendation = message.recommendation
    let alert
    if (message.notification && message.notification.object_class === 'Alert' && message.notification.objects)
      alert = message.notification.objects[0]
    const i = this.props.i
    // Profile image
    let author
    let profile_image_div
    // Get author
    if (message.author)
      author = message.author
    if (alert)
      author = alert.created_by
    // Test for listing without message
    if (message.notification && message.notification.subjects && message.notification.subjects[0].type === 'user')
      author = message.notification.subjects[0]
    if (author) {
      profile_image_div = (
        <ProfileImage data={ data } user={ author }/>
      )
    }
    // Rebot
    if (!author) {
      profile_image_div = (
        <div style={ S('absolute w-35 t-5') }>
          <img className="center-block" src="/images/dashboard/rebot@2x.png" style={ S('w-30') } />
        </div>
      )
    }

    // Message time
    const message_created = message.created_at.toString().split('.')
    const time_created = helpers.friendlyDate(message_created[0])

    // Message image
    let message_image = []
    const message_thumb_size = 'w-150 h-150'

    if (message.attachments.length) {
      const attachments = message.attachments

      if (message.attachments.length === 1) {
        message_image.push(
          <div style={ S('color-b0b0b0 fw-600') }>Uploaded a file:</div>
        )
      } else {
        message_image.push(
          <div style={ S('color-b0b0b0 fw-600') }>Uploaded { attachments.length } files:</div>
        )
      }

      attachments.forEach(attachment => {
        const file_url = attachment.url
        const ext = attachment.info['mime-extension']
        let message_thumb
        // If image
        if (ext.indexOf('png') !== -1 || ext.indexOf('jpg') !== -1 || ext.indexOf('gif') !== -1) {
          message_thumb = (
            <div style={ S(message_thumb_size + ' br-3 bg-url(' + file_url + ') no-repeat bg-cover mb-10') }></div>
          )
        } else {
          message_thumb = (
            <div style={ S(message_thumb_size) }>
              <i style={ S('font-150') } className="text-primary fa fa-file-o"></i>
              <br />
              <div style={ S('text-center relative t-90n l-15n font-35 fw-700 color-e0523e') }>
                { ext }
              </div>
            </div>
          )
        }
        message_image.push(
          <div style={ S('pull-left') }>
            <div onClick={ this.props.showFileViewer.bind(this, attachment) } style={ { ...S('mt-10'), cursor: 'zoom-in' } }>
              { message_thumb }
            </div>
          </div>
        )
      })
    }

    // Fade in
    let message_class_name
    if (message.fade_in)
      message_class_name = 'fade-in'

    let message_text = message.comment
    if (!message_image && message.comment) {
      message_text = emojify.replace(linkifyString(message.comment))
      message_text = this.makeMentionBlue(message_text)
    }

    // Get latest author and group (No profile image)
    if (message.author && !this.props.new_date && !message.recommendation) {
      if (messages[i - 1] && messages[i - 1].author && messages[i - 1].author.id === message.author.id) {
        return (
          <div style={ S('relative mb-5 font-15') }>
            <div className="pull-left" style={ S('ml-55') }>
              <div className={ message_class_name } dangerouslySetInnerHTML={ { __html: message_text } }></div>
              { message_image }
            </div>
            <div className="clearfix"></div>
          </div>
        )
      }
    }
    // Sharing a listing
    if (recommendation) {
      const listing = recommendation.listing
      let card_width = 'w-500'
      if (data.is_mobile)
        card_width = 'w-280'
      const placeholder_style = {
        ...S(message_thumb_size + ' bg-efefef h-100 color-ccc font-40 relative z-0 ' + card_width),
        borderTopLeftRadius: '3px',
        borderTopRightRadius: '3px'
      }
      message_image = (
        <div style={ placeholder_style }>
          <div style={ S('text-center w-100p absolute t-22') }>
            <i className="fa fa-picture-o"></i>
          </div>
        </div>
      )
      if (listing && listing.cover_image_url) {
        const cover_image_url = message.recommendation.listing.cover_image_url
        message_image = (
          <div style={ S('h-200 bg-url(' + cover_image_url + ') bg-cover bg-center ' + card_width) }></div>
        )
      }
      // Hide recommendation notification message
      let price = listing.price
      if (listing.close_price && user.user_type === 'Agent')
        price = listing.close_price
      const card_style = {
        ...S('mt-10 pointer border-1-solid-e7e4e3 br-3' + card_width),
        overflow: 'hidden'
      }
      // Listing status
      const status_color = listing_util.getStatusColor(listing.status)
      let sold_date
      if (listing.close_date) {
        const sold_date_obj = helpers.friendlyDate(listing.close_date)
        sold_date = `${sold_date_obj.month} ${sold_date_obj.date}, ${sold_date_obj.year}`
      }
      const underlay_style = {
        opacity: '.6',
        ...S('bg-000 relative t-7 br-100 ml-5 pt-11 h-30 pl-36 pr-10 mr-15')
      }
      const listing_status_indicator = (
        <div style={ S('relative z-1') }>
          <div className="pull-left" style={ underlay_style }>
            <div style={ { opacity: '0' } }>
              <span style={ S('mr-5 font-46 l-10 t-17n absolute color-' + status_color) }>&#8226;</span>
              <span style={ S('font-14 relative t-5n color-fff') }>
                <b>{ listing.status } { sold_date }</b>
              </span>
            </div>
          </div>
          <div className="pull-left" style={ S('absolute t-7 br-100 ml-5 pt-11 h-35 pl-36 pr-15 mr-15') }>
            <span style={ S('font-40 l-8 t-15n absolute color-' + status_color) }>&#8226;</span>
            <span style={ S('font-14 relative t-7n l-5n color-fff') }>
              <b>{ listing.status } { sold_date }</b>
            </span>
          </div>
        </div>
      )
      const share_info_style = {
        ...S('pointer p-15 pt-10'),
        borderBottomLeftRadius: '3px',
        borderBottomRightRadius: '3px'
      }
      profile_image_div = (
        <ProfileImage data={ data } user={ author ? author : null } />
      )
      if (!author) {
        profile_image_div = (
          <div style={ S('absolute w-35 t-5') }>
            <img className="center-block" src="/images/dashboard/rebot@2x.png" style={ S('w-30') } />
          </div>
        )
      }
      // If text comment
      let message_area = (
        <div style={ S('mt-5 pull-left ml-10 w-80p mt-10 font-15') } className={ message_class_name } dangerouslySetInnerHTML={ { __html: '"' + message_text + '"' } }></div>
      )
      // If image comment
      if (!message_text && message.attachments && message.attachments.length) {
        const attachment = message.attachments[0]
        const image_url = attachment.url
        message_area = (
          <div style={ S('mt-5 pull-left ml-10 w-80p mt-10 font-15') } className={ message_class_name }>
            <div style={ S('color-b0b0b0 fw-600 font-16 mb-10') }>{ author.first_name } uploaded an image:</div>
            <div onClick={ this.props.showFileViewer.bind(this, attachment) } style={ S(`bg-url(${image_url}) bg-cover w-80p h-200 mb-10`) }></div>
          </div>
        )
      }
      let notification_message
      if (message.notification && message.notification.action === 'BecameAvailable')
        notification_message = ' just hit the market'
      if (message.notification && message.notification.action === 'PriceDropped')
        notification_message = ' price changed'
      return (
        <div className="message-item" style={ S('relative mb-15 font-15') }>
          <div style={ S('mt-5 pull-left') }>
            { profile_image_div }
          </div>
          <div className="pull-left" style={ S('pt-6 ml-55 ' + card_width) }>
            <b>{ author ? author.display_name : 'Rebot' }</b>
            <span style={ S('color-ccc ml-20') } >
              { time_created.month } { time_created.date }, { time_created.time_friendly }
            </span>
            <div>
              <span style={ S('color-b0b0b0 fw-600 font-16') }>{ author ? 'Shared a Home:' : ''}</span>&nbsp;
              <span onClick={ this.props.showListingViewer.bind(this, message.recommendation.listing) } style={ S('fw-600 pointer') } className="text-primary">
                { listing_util.addressTitle(listing.property.address) }, { listing.property.address.postal_code }
              </span>
              { !author ? ' ' + notification_message : '' }
            </div>
            <div onClick={ this.props.showListingViewer.bind(this, message.recommendation.listing) } style={ card_style }>
              <div style={ S('relative t-5 l-5') }>{ listing_status_indicator }</div>
              <div>{ message_image }</div>
              <div style={ share_info_style }>
                <div style={ S('font-20 fw-700') }>${ helpers.numberWithCommas(price) }</div>
                <div style={ S('font-15 color-929292') }>
                  { listing.property.bedroom_count } Beds&nbsp;&nbsp;&#8226;&nbsp;&nbsp;
                  { listing.property.bathroom_count } Bath&nbsp;&nbsp;&#8226;&nbsp;&nbsp;
                  { helpers.numberWithCommas(listing_util.metersToFeet(listing.property.square_meters)) } Sqft&nbsp;&nbsp;&#8226;&nbsp;&nbsp;
                  Built in { listing.property.year_built }
                </div>
                <div style={ S('mt-10 relative') }>
                  <div style={ S('mt-5 pull-left w-40 h-40') }>
                    { profile_image_div }
                  </div>
                  { message_area }
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="clearfix"></div>
        </div>
      )
    }
    // Default message area
    let message_area = (
      <div className={ message_class_name } dangerouslySetInnerHTML={ { __html: message_text } }></div>
    )
    // Alert
    let alert_area
    if (alert) {
      message_area = (
        <div>
          <div style={ S('mb-10 color-b0b0b0') }>Created an alert: <span onClick={ this.showAlertModal.bind(this, alert.id) } style={ S('fw-600 pointer') } className="text-primary">{ alert.title ? alert.title : alert.proposed_title }</span></div>
          <div>
            <div onClick={ this.showAlertModal.bind(this, alert.id) } style={ S('pointer pull-left mr-10') }>
              <img style={ S('br-3 w-75 h-75') } src="/images/dashboard/mls/map-tile.jpg"/>
            </div>
            <div style={ S('pull-left') }>
              <span onClick={ this.showAlertModal.bind(this, alert.id) } style={ S('pointer fw-600 font-18') }>{ alert.title ? alert.title : alert.proposed_title }</span>
              <div style={ S('color-b0b0b0') }>We'll keep you updated with new listings</div>
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
      )
    }

    let delivery_notification
    if (author && author.id === data.user.id) {
      // blue double check means at least one person has read the message.
      const double_check_color = message.acked_by && message.acked_by.length > 0 ? '2196f3' : 'c3c3c3'
      const double_check = (
        <span style={ S(`color-${double_check_color} ml-5`) }>
          <i className="fa fa-check" style={ S('font-12') } />
          <i className="fa fa-check" style={ S('font-12 ml-1n') } />
        </span>
      )
      const message_info_dialog = (
        <Popover id="popover-message-info" title="Message Info">
          {
            message.acked_by &&
            <div className="content read-by">
              <div className="title">
                <span style={ S('color-2196f3') }>
                  <i className="fa fa-check" style={ S('font-12') } />
                  <i className="fa fa-check" style={ S('font-12 mr-5 ml-1n') } />
                </span>
                READ BY
              </div>
              <div className="report">
                {
                  _.uniq(message.acked_by)
                  .map(id => {
                    const user_info = _.find(current_room.users, { id })
                    return (
                      <div className="item">
                        <ProfileImage size={30} font={12} data={ data } user={ user_info } show_online_indicator={ false } />
                        <div className="name">{ user_info.display_name }</div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          }

          {
            message.deliveries &&
            <div className="content delivered-to">
              <div className="title">
                <span style={ S('color-c3c3c3') }>
                  <i className="fa fa-check" style={ S('font-12') } />
                  <i className="fa fa-check" style={ S('font-12 mr-5 ml-1n') } />
                </span>
                DELIVERED TO
              </div>
              <div className="report">
                {
                  _.uniqBy(message.deliveries, dlvr => dlvr.user)
                  .map(dlvr => {
                    const user_info = _.find(current_room.users, { id: dlvr.user })
                    const user_info_date = helpers.friendlyDate(user_info.created_at)
                    return (
                      <div className="item">
                        <ProfileImage size={30} font={12} data={ data } user={ user_info } show_online_indicator={ false } />
                        <div className="name">{ user_info.display_name }</div>
                        <div className="time">
                          <span style={ S('color-9b9b9b mr-6') } >{ user_info_date.day}</span>{ user_info_date.time_friendly }
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          }
        </Popover>
      )

      delivery_notification = (
        <span>
          { double_check }
          {
            (message.acked_by || message.deliveries) &&
            <OverlayTrigger trigger="click" rootClose placement="right" overlay={message_info_dialog}>
              <i className="fa fa-info-circle" style={ S('color-2196f3 ml-5') } />
            </OverlayTrigger>
          }
        </span>
      )
    }

    // Default
    return (
      <div className="message-item" style={ S('relative mb-5 font-15') }>
        <div style={ S('mt-5 pull-left') }>{ profile_image_div }</div>
        <div className="pull-left" style={ S('ml-55 pt-6') }>
          <b>{ author ? author.display_name : 'Rebot' }</b>
          <span style={ S('color-ccc ml-20') } >
            { time_created.month } { time_created.date }, { time_created.time_friendly } { delivery_notification }
          </span>
          { message_area }
          { message_image }
          { alert_area }
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
  showFileViewer: React.PropTypes.func,
  new_date: React.PropTypes.bool,
  showListingViewer: React.PropTypes.func,
  showAlertModal: React.PropTypes.func
}
