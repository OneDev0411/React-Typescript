// Dashboard/Partials/ShareListingModal.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'
import { Button, Modal, Input } from 'react-bootstrap'
import controller from '../controller'
import Select from 'react-select'
import listing_util from '../../../../utils/listing'
import helpers from '../../../../utils/helpers'
import validator from 'validator'
import SelectContainer from './SelectContainer'
import { getResizeAvatarUrl } from '../../../../utils/user'
export default class ShareListingModal extends Component {
  inputChange(e) {
    // Enter clicked
    const data = this.props.data
    if (e.which === 13) {
      if (data.share_modal && data.share_modal.items_selected && data.share_modal.search_value) {
        // Emails
        if (validator.isEmail(data.share_modal.search_value)) {
          data.share_modal.items_selected.push({
            email: data.share_modal.search_value,
            type: 'email',
            label: data.share_modal.search_value,
            value: data.share_modal.search_value
          })
          this.props.addUsersToSearchInput(data.share_modal.items_selected)
        }
        // Phone numbers
        if (validator.isNumeric(data.share_modal.search_value)) {
          data.share_modal.items_selected.push({
            email: data.share_modal.search_value,
            type: 'phone_number',
            label: data.share_modal.search_value,
            value: data.share_modal.search_value
          })
          this.props.addUsersToSearchInput(data.share_modal.items_selected)
        }
      }
    }
  }
  handleChange(users_selected) {
    this.props.addUsersToSearchInput(users_selected)
  }
  handleInputChange(value) {
    this.props.handleInputChange(value)
  }
  handleValueRender(value) {
    let profile_image
    let display_name
    if (value.type === 'contact') {
      const user = value.value.contact_user
      profile_image = <div style={ S(`absolute l-0 t-0 pull-left mr-10 bg-url(${getResizeAvatarUrl(user.profile_image_url)}?w=160) w-26 h-26 bg-cover bg-center`) }/>
      display_name = (
        <div style={ S(`pull-left ml-32`) }>
          { value.value.contact_user.first_name }
        </div>
      )
    }
    return (
      <div>
        { profile_image }
        { display_name }
      </div>
    )
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
        <Modal.Header closeButton style={ S('border-bottom-1-solid-b2b2b2 bg-fafafa') }>
          <Modal.Title className="din" style={ S('font-36 ml-15 color-4a4a4a') }>Share Listing</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ S('p-0 h-300') }>
          <div style={ S('relative w-100p h-50 p-10 bg-fff border-bottom-1-solid-e2e6ea bg-fafafa') }>
            <div style={ S('absolute l-10 t-15') }>To:</div>
            <div className="create-item__user-select" style={ S('absolute l-35 t-5 w-90p z-1000') }>
              <SelectContainer inputChange={ this.inputChange.bind(this) }>
                <Select
                  autofocus
                  name="users"
                  options={ users_select_options }
                  placeholder="Enter name, email or phone"
                  value={ users_selected ? users_selected : null }
                  multi
                  noResultsText={ 'No users found'}
                  style={ S('border-none mt-3') }
                  onInputChange={ this.handleInputChange.bind(this) }
                  onChange={ this.handleChange.bind(this) }
                  valueRenderer={ this.handleValueRender.bind(this) }
                />
              </SelectContainer>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={ S('bg-fff') }>
          <div style={ S('mr-15 mb-20 border-1-solid-d5dce5 bg-e7eaed br-3 w-220 h-64 p-6') }>
            <div style={ S(`pull-left mr-10 w-50 h-50 bg-cover bg-center bg-url(${ current_listing ? current_listing.cover_image_url : '' })`) }/>
            <div style={ S('pull-left') }>
              <div>{ current_listing && current_listing.property ? listing_util.addressTitle(current_listing.property.address) : '' }</div>
              <div style={ S('text-left') }>${ price }</div>
            </div>
          </div>
          <div>
            <div style={ S('pull-left w-400') }>
              <Input style={ S('border-none') } ref="message" type="text" placeholder="Write Message..."/>
            </div>
            <div style={ S('pull-right') }>
              <Button className={ share_modal && share_modal.sending_share || !this.isSharable() ? 'disabled' : '' } bsStyle="primary" onClick={ controller.listing_share.shareListing.bind(this) }>{ share_modal && !share_modal.sending_share ? 'Share' : 'Sending...' }</Button>
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
  addUsersToSearchInput: React.PropTypes.func,
  handleInputChange: React.PropTypes.func
}