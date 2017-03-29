// Dashboard/Partials/ShareListingModal.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'
import { Button, Modal, FormControl } from 'react-bootstrap'
import controller from '../controller'
import Select from 'react-select'
import listing_util from '../../../../utils/listing'
import helpers from '../../../../utils/helpers'
import validator from 'validator'
import SelectContainer from './SelectContainer'
import { getResizeAvatarUrl } from '../../../../utils/user'
import { getDisplayNameString } from '../../../../utils/room'
import ProfileImage from './ProfileImage'
import ProfileImageMultiple from './ProfileImageMultiple'
export default class ShareListingModal extends Component {
  inputChange(e) {
    // Enter clicked
    const data = this.props.data
    if (e.which === 13 || e.which === 9) {
      if (data.share_modal && data.share_modal.search_value)
        this.addToSelectedItems(data.share_modal.search_value)
    }
  }
  addToSelectedItems(value) {
    const data = this.props.data
    if (!data.share_modal.items_selected)
      data.share_modal.items_selected = []
    // Emails
    if (validator.isEmail(value)) {
      if (!_.find(data.share_modal.items_selected, { email: value })) {
        data.share_modal.items_selected.push({
          email: value,
          type: 'email',
          label: value,
          value
        })
        this.props.addUsersToSearchInput(data.share_modal.items_selected)
      }
    }
    // Phone numbers
    if (validator.isNumeric(value)) {
      if (!_.find(data.share_modal.items_selected, { email: value })) {
        data.share_modal.items_selected.push({
          email: value,
          type: 'phone_number',
          label: value,
          value
        })
        this.props.addUsersToSearchInput(data.share_modal.items_selected)
      }
    }
  }
  handleChange(users_selected) {
    this.props.addUsersToSearchInput(users_selected)
  }
  handleInputChange(value) {
    this.props.handleInputChange(value)
  }
  handleValueRenderer(item) {
    let profile_image
    const user = item.value
    if (user.profile_image_url || user.display_profile_image_url) {
      let profile_image_url
      if (user.profile_image_url)
        profile_image_url = user.profile_image_url
      if (user.display_profile_image_url)
        profile_image_url = user.display_profile_image_url
      profile_image = <div style={S(`pull-left bg-url(${getResizeAvatarUrl(profile_image_url)}?w=160) w-26 h-26 bg-cover bg-center`)} />
    }
    const display_name = (
      <div style={S('pull-left mt-4 ml-10 mr-5')}>
        { item.label }
      </div>
    )
    return (
      <div>
        { profile_image }
        { display_name }
      </div>
    )
  }
  handleOptionRenderer(item) {
    const data = this.props.data
    let profile_image
    if (item.type === 'room') {
      // Room
      if (item.value.users.length > 2) {
        profile_image = (
          <ProfileImageMultiple users={item.value.users} />
        )
      } else {
        const other_user = _.filter(item.value.users, user => user.id !== data.user.id)[0]
        profile_image = (
          <ProfileImage data={data} user={other_user} />
        )
      }
    } else {
      // Contact
      const user = item.value
      profile_image = (
        <ProfileImage data={data} user={user} />
      )
    }
    return (
      <div style={S(`relative ${item.index < 1 ? 'h-74' : 'h-54'}`)} className={item.index < 1 ? 'other-users--first' : ''} >
        <div style={S('mt-10')}>{ profile_image }</div>
        <div style={S('pull-left mt-10 ml-60 mr-5')}>{ item.label }</div>
        <div className="clearfix" />
      </div>
    )
  }
  isSharable() {
    const data = this.props.data
    if (data.share_modal && data.share_modal.search_value && data.share_modal.search_value.trim())
      return true
  }
  handleShareInputBlur() {
    const data = this.props.data
    this.addToSelectedItems(data.share_modal.search_value)
  }
  getContacts() {
    const data = this.props.data
    const contacts = data.contacts
    const contacts_found = []
    contacts.forEach((contact, i) => {
      const users = contact.users
      if (users) {
        // Loop through users
        contact.users.forEach((user) => {
          const deep_search = `${user.first_name ? user.first_name : ''} ${user.last_name ? user.last_name : ''} ${user.email ? user.email : ''} ${user.phone_number ? user.phone_number : ''} `
          contacts_found.push({
            value: user,
            label: user.first_name ? user.first_name : user.phone_number,
            deep_search,
            type: 'user',
            index: i
          })
        })
      } else {
        const sub_contact = contact.sub_contacts[0]
        if (sub_contact.attributes.emails) {
          // Loop through emails
          sub_contact.attributes.emails.forEach((email_obj) => {
            const deep_search = `${contact.display_name} ${email_obj.email}`
            contacts_found.push({
              value: email_obj.email,
              label: `${contact.display_name} ${email_obj.email}`,
              deep_search,
              type: 'email',
              index: i
            })
          })
        }
        // Loop through phone numbers
        if (sub_contact.attributes.phone_numbers) {
          sub_contact.attributes.phone_numbers.forEach((phone_number_obj) => {
            const deep_search = `${contact.display_name} ${phone_number_obj.phone_number}`
            contacts_found.push({
              value: phone_number_obj.phone_number,
              label: `${contact.display_name} ${phone_number_obj.phone_number}`,
              deep_search,
              type: 'phone_number',
              index: i
            })
          })
        }
      }
    })
    return contacts_found
  }
  render() {
    const data = this.props.data
    const current_listing = data.current_listing
    const share_modal = data.share_modal
    let users_select_options = []
    // Get users selected
    const users_selected = []
    let users_selected_ids = []
    if (data.share_modal && data.share_modal.items_selected) {
      const items_selected = data.share_modal.items_selected
      items_selected.forEach((item) => {
        users_selected.push(item)
      })
      // Contacts available
      users_selected_ids = _.map(users_selected, item => item.value.id)
    }
    // Rooms available
    if (data.rooms && !users_selected_ids.length) {
      data.rooms.forEach((room) => {
        if (room.users.length > 1) {
          // Test if user in available rooms
          if (users_selected_ids && users_selected_ids.length) {
            const room_user_ids = _.map(room.users, 'id')
            const has_all_users = users_selected_ids.every(id => room_user_ids.indexOf(id) !== -1)
            if (has_all_users && room_user_ids.length - 1 > users_selected_ids.length) {
              users_select_options.push({
                value: room,
                label: getDisplayNameString(room, data.user),
                type: 'room'
              })
            }
          } else {
            users_select_options.push({
              value: room,
              label: getDisplayNameString(room, data.user),
              type: 'room'
            })
          }
        }
      })
    }
    if (data.contacts) {
      data.contacts.forEach((contact) => {
        const user = contact.contact_user
        if (user) {
          if (user.id !== data.user.id && users_selected_ids && users_selected_ids.indexOf(user.id) === -1) {
            users_select_options.push({
              value: user,
              label: user.first_name ? user.first_name : contact.phone_number,
              type: 'user'
            })
          }
        }
      })
    }
    // Search users
    if (data.share_modal && data.share_modal.users_found) {
      data.share_modal.users_found.forEach((user, i) => {
        if (user) {
          if (user.id !== data.user.id && users_selected_ids && users_selected_ids.indexOf(user.id) === -1 && users_select_options.indexOf(user.id) === -1) {
            users_select_options.push({
              value: user,
              label: user.first_name ? user.first_name : user.phone_number,
              type: 'user',
              index: i
            })
          }
        }
      })
    }
    // Add reformatted contacts
    let contacts_found
    if (data.contacts)
      contacts_found = this.getContacts()
    if (contacts_found && contacts_found.length)
      users_select_options = [...users_select_options, ...contacts_found]

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
      <Modal dialogClassName={dialog_class_name} show={data.show_share_listing_modal} onHide={controller.listing_viewer.hideShareListingModal}>
        <Modal.Header style={S('bg-fafafa br-5 p-0 border-none')}>
          <div style={S('border-bottom-1-solid-ebebeb p-15')}>
            <a className="close" onClick={controller.listing_viewer.hideShareListingModal}>&times;</a>
            <Modal.Title className="din" style={S('font-36 ml-15 color-4a4a4a')}>Share Listing</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body style={S('p-0 h-300')}>
          <div style={S('relative w-100p h-50 p-10 bg-fff border-bottom-1-solid-e2e6ea bg-fafafa')}>
            <div style={S('absolute l-10 t-15')}>To:</div>
            <div className="create-item__user-select" style={S('absolute l-35 t-5 w-90p z-1000')}>
              <SelectContainer inputChange={this.inputChange.bind(this)}>
                <Select
                  ref={ref => this.myselectInput = ref}
                  autofocus
                  name="users"
                  options={users_select_options}
                  placeholder="Enter name, email or phone"
                  value={users_selected || null}
                  multi
                  noResultsText={'No users found'}
                  style={S('border-none mt-3')}
                  onInputChange={this.handleInputChange.bind(this)}
                  onChange={this.handleChange.bind(this)}
                  valueRenderer={this.handleValueRenderer.bind(this)}
                  optionRenderer={this.handleOptionRenderer.bind(this)}
                  onBlur={this.handleShareInputBlur.bind(this)}
                  onBlurResetsInput={false}
                />
              </SelectContainer>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div style={S('pull-left mr-15 mb-20 border-1-solid-d5dce5 bg-e7eaed br-3 inline-block p-6 pr-10')}>
            <div style={S(`pull-left mr-10 w-50 h-50 bg-cover bg-center bg-url(${current_listing ? current_listing.cover_image_url : ''})`)} />
            <div style={S('pull-left')}>
              <div style={S('color-333333')}>{ current_listing && current_listing.property ? listing_util.addressTitle(current_listing.property.address) : '' }</div>
              <div style={S('text-left color-8696a4')}>${ price }</div>
            </div>
          </div>
          <div className="clearfix" />
          <div>
            <div style={S('pull-left w-85p')}>
              <FormControl style={S('border-none')} inputRef={ref => this.messageInput = ref} type="text" placeholder="Write Message..." />
            </div>
            <div style={S('pull-right')}>
              <Button disabled={!this.isSharable()} className={share_modal && share_modal.sending_share || !this.isSharable() ? 'disabled' : ''} bsStyle="primary" onClick={controller.listing_share.shareListing.bind(this)}>{ share_modal && !share_modal.sending_share ? 'Share' : 'Sending...' }</Button>
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
