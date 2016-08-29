// Dashboard/Partials/ShareListingModal.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'
import { Button, Modal, Input } from 'react-bootstrap'
import controller from '../controller'
import Select from 'react-select'
import listing_util from '../../../../utils/listing'
import helpers from '../../../../utils/helpers'
export default class ShareListingModal extends Component {
  handleChange(users_selected) {
    this.props.addUsersToSearchInput(users_selected)
  }
  handleInputChange() {
    // console.log('handleInputChange')
  }
  isSharable() {
    const data = this.props.data
    if (data.share_modal && data.share_modal.items_selected && data.share_modal.items_selected.length)
      return true
  }
  render() {
    const data = this.props.data
    const current_listing = data.current_listing
    const share_modal = data.share_modal
    const users_select_options = []
    // Get users selected
    const users_selected = []
    if (data.share_modal && data.share_modal.items_selected) {
      const items_selected = data.share_modal.items_selected
      items_selected.forEach(item => {
        if (item.type === 'room') {
          // Parse users
          item.value.forEach(user => {
            if (user.id !== data.user.id) {
              users_selected.push({
                label: user.first_name,
                value: user,
                type: 'user'
              })
            }
          })
        } else
          users_selected.push(item)
      })
    }
    if (data.contacts) {
      data.contacts.forEach(user => {
        let full_name
        if (user.id !== data.user.id && user.first_name) {
          full_name = user.first_name
          if (user.last_name)
            full_name += ' ' + user.last_name
          if (!_.find(users_selected, { id: user.id })) {
            users_select_options.push({
              value: user,
              label: full_name,
              type: 'contact'
            })
          }
        }
      })
    }
    let dialog_class_name = 'modal-800'
    // Check if mobile
    if (data.is_mobile)
      dialog_class_name = 'modal-mobile'
    // Price
    let price = current_listing.price
    if (current_listing.close_price && data.user && data.user.user_type === 'Agent')
      price = current_listing.close_price
    price = helpers.numberWithCommas(price)
    return (
      <Modal dialogClassName={ dialog_class_name } show={ data.show_share_listing_modal } onHide={ controller.listing_viewer.hideShareListingModal }>
        <Modal.Header closeButton style={ S('border-bottom-1-solid-f8f8f8') }>
          <Modal.Title className="din" style={ S('font-36 ml-15 color-4a4a4a') }>Share Listing</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ S('p-0 h-300') }>
          <div style={ S('relative w-100p h-50 p-10 bg-fff border-bottom-1-solid-e2e6ea') }>
            <div style={ S('absolute l-10 t-15') }>To:</div>
            <div className="create-item__user-select" style={ S('absolute l-35 t-5 w-90p z-1000') }>
              <Select
                autofocus
                name="users"
                options={ users_select_options }
                onChange={ this.handleChange.bind(this) }
                placeholder="Enter name, email or phone"
                value={ users_selected ? users_selected : null }
                multi
                noResultsText={ 'No users found'}
                style={ S('border-none mt-3') }
                onInputChange={ this.handleInputChange.bind(this) }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={ S('bg-f8f8f8') }>
          <div style={ S('mr-15 mb-20 border-1-solid-d5dce5 bg-e7eaed br-3 w-220 h-64 p-6') }>
            <div style={ S(`pull-left mr-10 w-50 h-50 bg-cover bg-center bg-url(${ current_listing ? current_listing.cover_image_url : '' })`) }/>
            <div style={ S('pull-left') }>
              <div>{ current_listing && current_listing.property ? listing_util.addressTitle(current_listing.property.address) : '' }</div>
              <div style={ S('text-left') }>${ price }</div>
            </div>
          </div>
          <div>
            <div style={ S('pull-left w-400') }>
              <Input ref="message" type="text" placeholder="Write Message..."/>
            </div>
            <div style={ S('pull-right') }>
              <Button onClick={ controller.listing_viewer.hideShareListingModal } bsStyle="link">Cancel</Button>
              <Button className={ share_modal && share_modal.sending_share || !this.isSharable() ? 'disabled' : '' } bsStyle="primary" onClick={ controller.listing_share.shareListing.bind(this) }>{ share_modal && !share_modal.sending_share ? 'Share Listing' : 'Sending...' }&nbsp;&nbsp;<i className="fa fa-share"></i></Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }
}
ShareListingModal.propTypes = {
  data: React.PropTypes.object,
  handleFilterChange: React.PropTypes.func,
  handleEmailChange: React.PropTypes.func,
  handlePhoneNumberChange: React.PropTypes.func,
  handleAddEmail: React.PropTypes.func,
  handleAddPhoneNumber: React.PropTypes.func,
  handleRemoveShareItem: React.PropTypes.func,
  addUsersToSearchInput: React.PropTypes.func
}