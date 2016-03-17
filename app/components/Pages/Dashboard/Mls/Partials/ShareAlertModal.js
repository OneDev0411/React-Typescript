// Dashboard/Mls/index.js
import React, { Component } from 'react'
import S from 'shorti'
// import _ from 'lodash'
import { Button, Modal, Alert } from 'react-bootstrap'
import controller from '../controller'
// import ProfileImage from '../../Partials/ProfileImage'

export default class ShareAlertModal extends Component {
  onShow() {
    setTimeout(() => {
      this.refs.alert_title.focus()
    }, 100)
  }

  shareAlert() {
    const title = this.refs.alert_title.value
    this.props.shareAlert(title)
  }
  render() {
    const data = this.props.data
    const listing_map = data.listing_map
    // const contacts = data.contacts
    // const rooms = data.rooms
    // const share_list = data.share_list
    let message
    if (data.error) {
      message = (
        <Alert bsStyle="danger" closeButton className="text-left">{ data.error.message }</Alert>
      )
    }
    // const contacts_rooms_scroll = {
    //   overflowY: 'scroll',
    //   ...S('w-100p maxh-200 relative border-1-solid-ccc br-3')
    // }
    // let share_stats
    // if (share_list && share_list.rooms.length || share_list && share_list.contacts.length) {
    //   let space
    //   if (share_list.rooms.length && share_list.contacts.length) {
    //     space = (
    //       <span>&nbsp;and&nbsp;</span>
    //     )
    //   }
    //   share_stats = (
    //     <div style={ S('font-14 pull-right mt-10 color-006aff') }>
    //       { share_list.rooms.length ? share_list.rooms.length + ' room' + (share_list.rooms.length !== 1 ? 's' : '') : '' }
    //       { space }
    //       { share_list.contacts.length ? share_list.contacts.length + ' contact' + (share_list.contacts.length !== 1 ? 's' : '') : '' }
    //       &nbsp;&nbsp;selected
    //     </div>
    //   )
    // }
    // let rooms_list
    // if (rooms) {
    //   rooms_list = rooms.map(room => {
    //     // List users
    //     const users = room.users
    //     const first_names = _.pluck(users, 'first_name')
    //     let first_name_list = ''
    //     first_names.forEach((first_name, _i) => {
    //       first_name_list += first_name
    //       if (_i < first_names.length - 1) first_name_list += ', '
    //     })
    //     let author
    //     let profile_image_div
    //     if (room.latest_message && room.latest_message.author) {
    //       author = room.latest_message.author
    //       profile_image_div = (
    //         <ProfileImage data={ data } user={ author }/>
    //       )
    //     }
    //     if (!room.latest_message || !room.latest_message.author) {
    //       profile_image_div = (
    //         <div style={ S('absolute w-35') }>
    //           <img className="center-block" src="/images/dashboard/rebot@2x.png" style={ S('w-30') } />
    //         </div>
    //       )
    //     }
    //     let selected
    //     if (share_list && share_list.rooms && share_list.rooms.includes(room.id)) {
    //       selected = (
    //         <div style={ S('absolute t-18 r-10') }>
    //           <div style={ S('br-100 bg-006aff w-25 h-25 pt-3 text-center') }><i style={ S('color-fff') } className="fa fa-check"></i></div>
    //         </div>
    //       )
    //     }
    //     return (
    //       <div onClick={ controller.addToShareList.bind(this, 'rooms', room.id) } style={ S('relative h-60 pointer p-10' + (selected ? ' bg-EDF7FD' : '')) } className="share-item" key={ 'share-alert__room-' + room.id }>
    //         { profile_image_div }
    //         <div className="pull-left" style={ S('ml-50 w-90p') }>
    //           <div className="pull-left">
    //             <b>{ room.title.substring(0, 50) }{ room.title.length > 50 ? '...' : '' }</b>
    //           </div>
    //           <div className="clearfix"></div>
    //           <div style={ S('color-aaaaaa w-74p') }>{ first_name_list }</div>
    //         </div>
    //         { selected }
    //         <div className="clearfix"></div>
    //       </div>
    //     )
    //   })
    // }
    // let contacts_list
    // if (contacts) {
    //   contacts_list = contacts.map(contact => {
    //     let selected
    //     if (share_list && share_list.contacts && share_list.contacts.includes(contact.id)) {
    //       selected = (
    //         <div style={ S('absolute t-18 r-10') }>
    //           <div style={ S('br-100 bg-006aff w-25 h-25 pt-3 text-center') }><i style={ S('color-fff') } className="fa fa-check"></i></div>
    //         </div>
    //       )
    //     }
    //     return (
    //       <div onClick={ controller.addToShareList.bind(this, 'contacts', contact.id) } style={ S('h-60 relative p-3 pl-0 pr-10 mr-10 w-100p pointer p-10' + (selected ? ' bg-EDF7FD' : '')) } className="share-item" key={ 'share-alert__contact-' + contact.id }>
    //         <div style={ S('l-10 t-10 absolute') }>
    //           <ProfileImage data={ data } top={11} size={40} user={ contact }/>
    //         </div>
    //         <div style={ S('ml-65') }>
    //           <div>{ contact.first_name } { contact.last_name }</div>
    //           <div>{ contact.email }</div>
    //         </div>
    //         { selected }
    //       </div>
    //     )
    //   })
    // }
    return (
      <Modal show={ listing_map && listing_map.show_share_modal } onHide={ controller.hideModal } onShow={ this.onShow.bind(this) }>
        <Modal.Header closeButton style={ S('border-bottom-1-solid-f8f8f8') }>
          <Modal.Title className="tempo" style={ S('font-36') }>Share Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ S('p-30') }>
          <div style={ S('mb-20') }>
            <div style={ S('pull-left mr-15') }>
              <img style={ S('w-100 h-100 br-3') } src="/images/dashboard/mls/map-tile.jpg" />
            </div>
            <div style={ S('pull-left w-70p') }>
              <input style={ S('p-0 mb-5 border-1-solid-fff font-28 h-40') } ref="alert_title" type="text" placeholder="Name this alert..." />
              <div style={ S('color-929292 font-20') }>{ listing_map && listing_map.listings ? listing_map.listings.length : '' } Results</div>
              <div style={ S('color-929292 font-16') }>We’ll keep you updated with any new listings.</div>
            </div>
            <div className="clearfix"></div>
          </div>
          <div style={ S('mb-10') }>
            <div className="form-group" style={ S('relative') }>
              <img style={ S('absolute t-14 l-13') } src={ `/images/dashboard/mls/share-alert/chat.svg`} />
              <input style={ S('pl-50') } className="form-control input-lg" type="text" placeholder="Send to chatrooms and contacts"/>
            </div>
            <div className="form-group" style={ S('relative') }>
              <img style={ S('absolute t-18 l-12') } src={ `/images/dashboard/mls/share-alert/email.svg`} />
              <input style={ S('pl-50') } className="form-control input-lg" type="text" placeholder="Send as an email"/>
            </div>
            <div className="form-group" style={ S('relative') }>
              <img style={ S('absolute t-10 l-15') } src={ `/images/dashboard/mls/share-alert/sms.svg`} />
              <input style={ S('pl-50') } className="form-control input-lg" type="text" placeholder="Send an SMS"/>
            </div>
            <div className="clearfix"></div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          { message }
          <Button onClick={ controller.hideModal } bsStyle="link">Cancel</Button>
          <Button className={ listing_map && listing_map.saving_alert ? 'disabled' : '' } bsStyle="primary" onClick={ this.shareAlert.bind(this) }>{ listing_map && !listing_map.saving_alert ? 'Share Alert' : 'Saving...' }&nbsp;&nbsp;<i className="fa fa-share"></i></Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

// PropTypes
ShareAlertModal.propTypes = {
  data: React.PropTypes.object,
  shareAlert: React.PropTypes.func
}