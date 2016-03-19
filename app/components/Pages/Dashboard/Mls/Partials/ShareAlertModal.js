// Dashboard/Mls/index.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'
import { Button, Modal, Alert } from 'react-bootstrap'
import controller from '../controller'
import ProfileImage from '../../Partials/ProfileImage'
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
  handleFilterChange(e) {
    const filter_text = e.target.value
    this.props.handleShareFilter(filter_text)
  }
  render() {
    const data = this.props.data
    const listing_map = data.listing_map
    const share_modal = data.share_modal
    let rooms_added
    if (share_modal)
      rooms_added = share_modal.rooms_added
    let contacts_added
    if (share_modal)
      contacts_added = share_modal.contacts_added
    let rooms_filtered
    let contacts_filtered
    if (share_modal) {
      rooms_filtered = share_modal.rooms_filtered
      contacts_filtered = share_modal.contacts_filtered
    }
    let message
    if (data.error) {
      message = (
        <Alert bsStyle="danger" closeButton className="text-left">{ data.error.message }</Alert>
      )
    }
    const contacts_rooms_scroll = {
      overflowY: 'scroll',
      ...S('absolute z-1000 bg-fff t-50 w-100p maxh-380 border-1-solid-ccc br-3')
    }
    let rooms_list
    if (rooms_filtered) {
      rooms_list = rooms_filtered.map(room => {
        // List users
        const users = room.users
        const first_names = _.pluck(users, 'first_name')
        let first_name_list = ''
        first_names.forEach((first_name, _i) => {
          first_name_list += first_name
          if (_i < first_names.length - 1) first_name_list += ', '
        })
        let author
        let profile_image_div
        if (room.latest_message && room.latest_message.author) {
          author = room.latest_message.author
          profile_image_div = (
            <ProfileImage data={ data } user={ author }/>
          )
        }
        if (!room.latest_message || !room.latest_message.author) {
          profile_image_div = (
            <div style={ S('absolute w-35') }>
              <img className="center-block" src="/images/dashboard/rebot@2x.png" style={ S('w-30') } />
            </div>
          )
        }
        return (
          <div onClick={ controller.addToShareList.bind(this, 'rooms', room) } style={ S('relative h-60 pointer p-10') } className="share-item" key={ 'share-alert__room-' + room.id }>
            { profile_image_div }
            <div className="pull-left" style={ S('ml-50 w-90p') }>
              <div className="pull-left">
                <b>{ room.title.substring(0, 50) }{ room.title.length > 50 ? '...' : '' }</b>
              </div>
              <div className="clearfix"></div>
              <div style={ S('color-aaaaaa w-74p') }>{ first_name_list }</div>
            </div>
            <div className="clearfix"></div>
          </div>
        )
      })
    }
    let contacts_list
    if (contacts_filtered) {
      contacts_list = contacts_filtered.map(contact => {
        return (
          <div onClick={ controller.addToShareList.bind(this, 'contacts', contact) } style={ S('h-60 relative p-3 pl-0 pr-10 mr-10 w-100p pointer p-10') } className="share-item" key={ 'share-alert__contact-' + contact.id }>
            <div style={ S('l-10 t-10 absolute') }>
              <ProfileImage data={ data } top={11} size={40} user={ contact }/>
            </div>
            <div style={ S('ml-65') }>
              <div>{ contact.first_name } { contact.last_name }</div>
              <div>{ contact.email }</div>
            </div>
          </div>
        )
      })
    }
    let rooms_list_area
    if (rooms_list && rooms_list.length) {
      rooms_list_area = (
        <div>
          <div style={ S('bg-f8f8f8 color-929292 p-10') }>Rooms ({ rooms_list.length })</div>
          { rooms_list }
        </div>
      )
    }
    let contacts_list_area
    if (contacts_list && contacts_list.length) {
      contacts_list_area = (
        <div>
          <div style={ S('bg-f8f8f8 color-929292 p-10') }>Contacts ({ contacts_list.length })</div>
          { contacts_list }
        </div>
      )
    }
    let results
    if (rooms_filtered || contacts_filtered) {
      results = (
        <div style={ contacts_rooms_scroll }>
          { rooms_list_area }
          { contacts_list_area }
        </div>
      )
    }
    const filter_text_style = {
      ...S('p-0 mb-5 border-1-solid-fff font-28 h-40'),
      outline: 'none'
    }
    const pill_style = S('bg-dadada color-4c7dbf pr-10 pl-10 pt-5 pb-5 br-3 pull-left mr-5 mb-5')
    const items_added_pills = []
    let rooms_added_pills = []
    if (rooms_added) {
      rooms_added_pills = rooms_added.map(room => {
        return (
          <div key={ 'pill-room-' + room.id } style={ pill_style }><span className="close">&times;</span> { room.title }</div>
        )
      })
      items_added_pills.push(rooms_added_pills)
    }
    let contacts_added_pills = []
    if (contacts_added) {
      contacts_added_pills = contacts_added.map(contact => {
        return (
          <div key={ 'pill-contact-' + contact.id } style={ pill_style }><span className="close">&times;</span> { contact.first_name } { contact.last_name }</div>
        )
      })
      items_added_pills.push(contacts_added_pills)
    }
    let items_added_area
    if (items_added_pills && items_added_pills.length) {
      items_added_area = (
        <div style={ S('w-550 pull-left') }>
          { rooms_added_pills }
          { contacts_added_pills }
        </div>
      )
    }
    let filter_text
    if (share_modal)
      filter_text = share_modal.filter_text
    return (
      <Modal dialogClassName="modal-800" show={ listing_map && listing_map.show_share_modal } onHide={ controller.hideModal } onShow={ this.onShow.bind(this) }>
        <Modal.Header closeButton style={ S('border-bottom-1-solid-f8f8f8') }>
          <Modal.Title className="tempo" style={ S('font-36') }>Share Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ S('p-30') }>
          <div style={ S('mb-20') }>
            <div style={ S('pull-left mr-15') }>
              <img style={ S('w-100 h-100 br-3') } src="/images/dashboard/mls/map-tile.jpg" />
            </div>
            <div style={ S('pull-left w-70p') }>
              <input style={ filter_text_style } ref="alert_title" type="text" placeholder="Name this alert..." />
              <div style={ S('color-929292 font-20') }>{ listing_map && listing_map.listings ? listing_map.listings.length : '' } Results</div>
              <div style={ S('color-929292 font-16') }>We’ll keep you updated with any new listings.</div>
            </div>
            <div className="clearfix"></div>
          </div>
          <div style={ S('mb-10') }>
            <div className="form-group" style={ S('relative') }>
              <img style={ S('absolute t-14 l-20') } src={ `/images/dashboard/mls/share-alert/chat.svg`} />
              <input onChange={ this.handleFilterChange.bind(this) } value={ filter_text } style={ S('pl-62 w-600 pull-left mr-10') } className="form-control input-lg" type="text" placeholder="Send to chatrooms and contacts"/>
              <Button bsSize="large" style={ S('w-120 h-46 bg-d3d7d9 color-fff font-13 pull-left') } type="text">Add</Button>
              { results }
              <div className="clearfix"></div>
            </div>
            <div className="form-group" style={ S('relative') }>
              <img style={ S('absolute t-18 l-15') } src={ `/images/dashboard/mls/share-alert/email.svg`} />
              <input style={ S('pl-62 w-600 pull-left mr-10') } className="form-control input-lg" type="text" placeholder="Send as an email"/>
              <Button bsSize="large" style={ S('w-120 h-46 bg-d3d7d9 color-fff font-13 pull-left') } type="text">Add Email</Button>
              <div className="clearfix"></div>
            </div>
            <div className="form-group" style={ S('relative') }>
              <img style={ S('absolute t-10 l-20') } src={ `/images/dashboard/mls/share-alert/sms.svg`} />
              <input style={ S('pl-62 w-600 pull-left mr-10') } className="form-control input-lg" type="text" placeholder="Send an SMS"/>
              <Button bsSize="large" style={ S('w-120 h-46 bg-d3d7d9 color-fff font-13 pull-left') } type="text">Add Number</Button>
              <div className="clearfix"></div>
            </div>
            <div className="clearfix"></div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          { message }
          { items_added_area }
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
  shareAlert: React.PropTypes.func,
  handleShareFilter: React.PropTypes.func
}