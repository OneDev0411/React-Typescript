// Dashboard/Partials/ShareListingModal.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'
import { Button, Modal, FormControl } from 'react-bootstrap'
import controller from '../../controller'
import Select from 'react-select'
import validator from 'validator'
import SelectContainer from '../../Partials/SelectContainer'
import { getResizeAvatarUrl } from '../../../../../utils/user'
import { getDisplayNameString } from '../../../../../utils/room'
import ProfileImage from '../../Partials/ProfileImage'
import ProfileImageMultiple from '../../Partials/ProfileImageMultiple'
export default class ShareAlertModal extends Component {
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
    // this.refs.myselect.refs.input.blur()
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
      profile_image = <div style={ S(`pull-left bg-url(${getResizeAvatarUrl(profile_image_url)}?w=160) w-26 h-26 bg-cover bg-center`) }/>
    }
    const display_name = (
      <div style={ S(`pull-left mt-4 ml-10 mr-5`) }>
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
    if (item.type === 'user') {
      // Contact
      const user = item.value
      profile_image = (
        <ProfileImage data={ data } user={ user }/>
      )
    } else {
      // Room
      if (item.value.users.length > 2) {
        profile_image = (
          <ProfileImageMultiple users={ item.value.users }/>
        )
      } else {
        const other_user = _.filter(item.value.users, user => user.id !== data.user.id)[0]
        profile_image = (
          <ProfileImage data={ data } user={ other_user }/>
        )
      }
    }
    return (
      <div style={ S('relative ' + (item.index < 1 ? 'h-74' : 'h-54')) } className={ item.index < 1 ? 'other-users--first' : '' } >
        <div style={ S('mt-10') }>{ profile_image }</div>
        <div style={ S('pull-left mt-10 ml-60 mr-5') }>{ item.label }</div>
        <div className="clearfix"/>
      </div>
    )
  }
  isSharable() {
    const data = this.props.data
    if (data.share_modal && data.share_modal.items_selected && data.share_modal.items_selected.length)
      return true
  }
  handleShareInputBlur() {
    this.addToSelectedItems(this.myselect.refs.input.refs.input.value)
    this.refs.myselect.value = ''
  }
  render() {
    // Data
    const data = this.props.data
    const share_modal = data.share_modal
    const users_select_options = []
    // Get users selected
    const users_selected = []
    let users_selected_ids = []
    if (data.share_modal && data.share_modal.items_selected) {
      const items_selected = data.share_modal.items_selected
      items_selected.forEach(item => {
        users_selected.push(item)
      })
      // Contacts available
      users_selected_ids = _.map(users_selected, item => {
        return item.value.id
      })
    }
    // Rooms available
    if (data.rooms && !users_selected_ids.length) {
      data.rooms.forEach(room => {
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
      data.contacts.forEach(contact => {
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
    let dialog_class_name = 'modal-800'
    // Check if mobile
    if (data.is_mobile)
      dialog_class_name = 'modal-mobile'
    let default_title = 'Alert'
    if (data.listing_map && data.listing_map.hasOwnProperty('listings_info'))
      default_title = data.listing_map.listings_info.proposed_title
    return (
      <Modal dialogClassName={ dialog_class_name } show={ data.listing_map && data.listing_map.show_share_modal } onHide={ controller.listing_map.hideModal }>
        <Modal.Header style={ S('bg-fafafa br-5 p-0 border-none') }>
          <div style={ S('border-bottom-1-solid-ebebeb p-15') }>
            <a className="close" onClick={ controller.listing_map.hideModal }>&times;</a>
            <Modal.Title className="din" style={ S('font-36 ml-15 color-4a4a4a') }>Share Alert</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body style={ S('p-0 h-300') }>
          <div style={ S('relative w-100p h-50 p-10 bg-fff border-bottom-1-solid-e2e6ea bg-fafafa') }>
            <div style={ S('absolute l-10 t-15') }>To:</div>
            <div className="create-item__user-select" style={ S('absolute l-35 t-5 w-90p z-1000') }>
              <SelectContainer inputChange={ this.inputChange.bind(this) }>
                <Select
                  input={ ref => this.myselectInput = ref }
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
                  valueRenderer={ this.handleValueRenderer.bind(this) }
                  optionRenderer={ this.handleOptionRenderer.bind(this) }
                  onBlur={ this.handleShareInputBlur.bind(this) }
                  onBlurResetsInput={ false }
                />
              </SelectContainer>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div style={ S('pull-left mr-15 mb-20 border-1-solid-d5dce5 bg-e7eaed br-3 inline-block') }>
            <div style={ S(`pull-left w-50 h-50 pt-20 text-center border-right-1-solid-d5dce5 h-64`) }>
              <img src="/static/images/dashboard/mls/alert-bell--gray.svg"/>
            </div>
            <div style={ S('pull-left p-15 pt-10 text-left h-64') }>
              <div>{ data.share_modal && data.share_modal.title ? data.share_modal.title : default_title }</div>
              <div style={ S('color-bfc3c7') }>You are sharing this alert</div>
            </div>
          </div>
          <div className="clearfix"></div>
          <div>
            <div style={ S('pull-left w-85p') }>
              <FormControl style={ S('border-none') } inputRef={ ref => this.messageInput = ref } type="text" placeholder="Write Message..."/>
            </div>
            <div style={ S('pull-right') }>
              <Button disabled={!this.isSharable() ? true : false} className={ share_modal && share_modal.sending_share || !this.isSharable() ? 'disabled' : '' } bsStyle="primary" onClick={ controller.alert_share.shareAlert.bind(this) }>{ share_modal && !share_modal.sending_share ? 'Share' : 'Sending...' }</Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }
}
ShareAlertModal.propTypes = {
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
