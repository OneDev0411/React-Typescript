// Sidebar.js
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem, NavDropdown, Modal, Col, FormControl, Button, Alert, DropdownButton, MenuItem } from 'react-bootstrap'
import S from 'shorti'
import _ from 'lodash'
import Dropzone from 'react-dropzone'
import Loading from '../../../Partials/Loading'
import MaskedInput from 'react-input-mask'
import { all_countries } from '../../../../utils/country-data'
import helpers from '../../../../utils/helpers'
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import AppStore from '../../../../stores/AppStore'
import ProfileImage from './ProfileImage'
export default class SideBar extends Component {

  showSettingsModal(e) {
    e.preventDefault()
    delete AppStore.data.error
    AppStore.data.show_account_settings_modal = true
    delete AppStore.data.phone_country
    AppStore.emitChange()
  }

  async componentDidUpdate() {
    // Refresh page on agent update
    const data = this.props.data
    this.phone_number_parsed = await helpers.parsePhoneNumber(data.user.phone_number)
  }

  showIntercom() {
    window.Intercom('show')
  }

  handleSubmit(e) {
    e.preventDefault()
    const data = this.props.data
    if (data.show_change_password) {
      this.changePassword()
      return
    }
    this.editAccountInfo()
  }

  async editAccountInfo() {
    const { PhoneNumberUtil } = await import('google-libphonenumber' /* webpackChunkName: "glpn" */)
    const phoneUtil = PhoneNumberUtil.getInstance()

    delete AppStore.data.error
    AppStore.emitChange()
    const data = this.props.data
    const user = data.user
    const first_name = this.first_nameInput.value.trim()
    const last_name = this.last_nameInput.value.trim()
    const email = this.emailInput.value.trim()
    const phone_number_input = this.phone_numberInput.value.replace(/\D/g, '').trim()
    let country_code = 1
    if (data.phone_country)
      country_code = data.phone_country.dialCode
    const phone_number = `+${country_code}${phone_number_input}`
    if (phone_number_input && !phoneUtil.isPossibleNumberString(phone_number)) {
      AppStore.data.error = {
        message: 'You must use a valid phone number'
      }
      AppStore.emitChange()
      return
    }
    const user_info = {
      first_name,
      last_name,
      email
    }
    if (phone_number_input && phoneUtil.isPossibleNumberString(phone_number))
      user_info.phone_number = phone_number
    AppStore.data.saving_account_settings = true
    AppStore.emitChange()
    AppDispatcher.dispatch({
      action: 'edit-user',
      user,
      user_info
    })
  }

  changePassword() {
    const data = this.props.data
    const user = data.user
    const old_password = this.old_passwordInput.value.trim()
    const new_password = this.new_passwordInput.value.trim()
    const new_password_confirm = this.new_password_confirmInput.value.trim()
    AppStore.data.saving_account_settings = true
    delete AppStore.data.error
    delete AppStore.data.password_changed
    AppStore.emitChange()
    // Check for values
    if (!old_password) {
      AppStore.data.error = {
        message: 'You must add a password'
      }
      delete AppStore.data.saving_account_settings
      AppStore.emitChange()
      return
    }
    if (!new_password) {
      AppStore.data.error = {
        message: 'You must add a new password'
      }
      delete AppStore.data.saving_account_settings
      AppStore.emitChange()
      return
    }
    // Check values match
    if (new_password !== new_password_confirm) {
      AppStore.data.error = {
        message: 'Your passwords don\'t match'
      }
      delete AppStore.data.saving_account_settings
      AppStore.emitChange()
      return
    }
    AppDispatcher.dispatch({
      action: 'edit-password',
      user,
      old_password,
      new_password
    })
  }

  hideModal() {
    delete AppStore.data.show_account_settings_modal
    delete AppStore.data.uploading_profile_pic
    delete AppStore.data.show_change_password
    delete AppStore.data.saving_account_settings
    delete AppStore.data.password_changed
    AppStore.emitChange()
  }

  notificationIcon() {
    const data = this.props.data
    let icon
    if (data.new_notifications_count && data.new_notifications_count > 0) {
      icon = (
        <i className="fa fa-circle" style={S('pl-10 font-8 color-3388FF absolute')} />
      )
    }
    return icon
  }

  uploadProfilePic(files) {
    const data = this.props.data
    const user = data.user
    AppStore.data.uploading_profile_pic = true
    AppStore.emitChange()
    AppDispatcher.dispatch({
      action: 'edit-profile-pic',
      user,
      files
    })
  }

  showPicOverlay() {
    AppStore.data.show_pic_overlay = true
    AppStore.emitChange()
  }

  hidePicOverlay() {
    delete AppStore.data.show_pic_overlay
    AppStore.emitChange()
  }

  showChangePassword() {
    AppStore.data.show_change_password = true
    AppStore.emitChange()
  }

  hideChangePassword() {
    delete AppStore.data.show_change_password
    AppStore.emitChange()
  }

  handleCountryCodeSelect(country) {
    AppStore.data.phone_country = {
      iso2: country.iso2,
      dialCode: country.dialCode
    }
    AppStore.emitChange()
  }

  hideListingViewer() {
    delete AppStore.data.show_listing_viewer
    delete AppStore.data.current_listing
    AppStore.emitChange()
  }
  handleChatNavClick() {
    const data = this.props.data
    const current_room = data.current_room
    delete AppStore.data.current_room_mobile
    delete AppStore.data.show_new_message_viewer
    AppStore.emitChange()
    if (data.current_listing)
      this.hideListingViewer()
    if (current_room)
      browserHistory.push(`/dashboard/recents/${current_room.id}`)
    else
      browserHistory.push('/dashboard/recents/')
  }
  render() {
    // Data
    const data = this.props.data
    const path = data.path

    const active = {}
    if (path.indexOf('/dashboard/recents') !== -1)
      active.recents = 'active'
    if (path.indexOf('/dashboard/mls') !== -1)
      active.mls = 'active'

    if (path.indexOf('/dashboard/contacts') !== -1)
      active.contacts = 'active'

    if (path.indexOf('/dashboard/mls/listings/recommend') !== -1)
      active.recommend = 'active'

    if (path.indexOf('/dashboard/mls/agents') !== -1)
      active.agents = 'active'

    // User info
    const user = data.user
    let recommend
    let agents
    if (data.user.user_type === 'Brokerage') {
      recommend = (
        <LinkContainer className={active.recommend} to="/dashboard/mls/listing/recommend">
          <NavItem style={S('w-85p')}>
            <i className="fa fa-tasks" />
          </NavItem>
        </LinkContainer>
      )
      agents = (
        <LinkContainer className={active.agents} to="/dashboard/mls/agents">
          <NavItem style={S('w-85p')}>
            <i className="fa fa-group" />
          </NavItem>
        </LinkContainer>
      )
    }
    const dropzone_style = {
      ...S('w-100 h-100')
    }
    let overlay_class = 'hidden'
    if (data.show_pic_overlay)
      overlay_class = ''
    let profile_image_area = (
      <Dropzone onMouseLeave={this.hidePicOverlay.bind(this)} onMouseEnter={this.showPicOverlay.bind(this)} multiple={false} onDrop={this.uploadProfilePic.bind(this)} type="button" style={dropzone_style}>
        <div className={overlay_class} style={S('pointer')}>
          <div style={{ ...S('absolute z-101 color-fff text-center t-20 w-80') }}>
            Edit<br />picture
          </div>
          <div style={{ ...S('bg-100 br-100 absolute w-80 h-80 z-100 color-fff'), opacity: '.3' }} />
        </div>
        <ProfileImage
          size={80}
          data={data}
          user={user}
          font={40}
          top={15}
        />
      </Dropzone>
    )
    if (data.uploading_profile_pic) {
      profile_image_area = (
        <div style={S('absolute t-60n l-42')}>
          <Loading />
        </div>
      )
    }
    let change_password_area = (
      <a style={S('mt-7')} className="pull-left" href="#" onClick={this.showChangePassword.bind(this)}>Change password</a>
    )

    const current_country_code = this.phone_number_parsed ? this.phone_number_parsed.country_code : ''
    let phone_country = `+${current_country_code}`
    if (data.phone_country)
      phone_country = `+${data.phone_country.dialCode}`
    const country_codes = (
      <DropdownButton title={phone_country} id="input-dropdown-country-codes" style={S('pb-9')}>
        <MenuItem key={1} onClick={this.handleCountryCodeSelect.bind(this, _.find(all_countries, { iso2: 'us' }))}>United States +1</MenuItem>
        {
          all_countries.map((country, i) => {
            if (country.dialCode !== 1)
              return <MenuItem onClick={this.handleCountryCodeSelect.bind(this, country)} key={country.iso2 + country.dialCode + i}>{ country.name } +{ country.dialCode }</MenuItem>
          })
        }
      </DropdownButton>
    )
    let message
    if (data.error) {
      message = (
        <Alert bsStyle="danger">
          { data.error.message }
        </Alert>
      )
    }
    let form_fields = (
      <Col xs={9}>
        <div>
          <label>First name</label>
          <FormControl inputRef={ref => this.first_nameInput = ref} type="text" defaultValue={user.first_name} />
        </div>
        <div>
          <label>Last name</label>
          <FormControl inputRef={ref => this.last_nameInput = ref} type="text" defaultValue={user.last_name} />
        </div>
        <div>
          <label>Email</label>
          <FormControl inputRef={ref => this.emailInput = ref} type="text" defaultValue={user.email} />
        </div>
        <div>
          <label>Phone number</label>
          <div className="input-group">
            <div className="input-group-btn input-dropdown--country-codes">
              { country_codes }
            </div>
            <MaskedInput className="form-control" ref={ref => this.phone_numberInput = ref} type="text" defaultValue={user.phone_number ? this.phone_number_parsed.phone_number : ''} mask="(999)-999-9999" maskChar="_" />
          </div>
        </div>
        <div className="clearfix" />
        <Col style={S('pr-0')} xs={12}>{ message }</Col>
      </Col>
    )
    if (data.password_changed) {
      message = (
        <Alert bsStyle="success">
          Success. Password changed.
        </Alert>
      )
    }
    if (data.show_change_password) {
      form_fields = (
        <Col xs={9} style={S('p-0')}>
          <Col xs={12} style={S('pr-0')}>
            <label>Current password</label>
            <FormControl key={'password'} inputRef={ref => this.old_passwordInput = ref} type="password" defaultValue="" />
          </Col>
          <Col xs={12} style={S('pr-0')}>
            <label>New password</label>
            <FormControl key={'new_password'} inputRef={ref => this.new_passwordInput = ref} type="password" defaultValue="" />
          </Col>
          <Col xs={12} style={S('pr-0')}>
            <label>Confirm new password</label>
            <FormControl key={'new_password_confirm'} inputRef={ref => this.new_password_confirmInput = ref} type="password" defaultValue="" />
            { message }
          </Col>
        </Col>
      )
      change_password_area = (
        <a style={S('mt-7')} className="pull-left" href="#" onClick={this.hideChangePassword.bind(this)}>Cancel change password</a>
      )
    }
    const title_area = (
      <div>&nbsp;</div>
    )
    const mobile_nav_style = S('b-0 h-60 pt-10 w-100p fixed z-100 bg-263445')
    return (
      <aside className="mobile-nav" style={mobile_nav_style}>
        { /* cache images */ }
        <div style={S('w-0 h-0 absolute l-1000n t-1000n')}>
          <img src="/static/images/dashboard/sidenav/chat-active.svg" />
          <img src="/static/images/dashboard/sidenav/map-active.svg" />
          <img src="/static/images/dashboard/sidenav/people-active.svg" />
          <img src="/static/images/dashboard/sidenav/task-active.svg" />
        </div>
        <Nav bsStyle="tabs" justified>
          <LinkContainer className={`main-nav ${active.recents}`} to="/dashboard/recents">
            <NavItem style={S('w-60 pull-left')} onClick={this.handleChatNavClick.bind(this)}>
              <img src={active.recents ? '/static/images/dashboard/sidenav/chat-active.svg' : '/static/images/dashboard/sidenav/chat.svg'} style={S('w-19 h-19')} />
              {this.notificationIcon('room_notification_count')}
            </NavItem>
          </LinkContainer>
          <LinkContainer className={`main-nav ${active.mls}`} to="/dashboard/mls">
            <NavItem style={S('w-60 pull-left')}>
              <img src={active.mls ? '/static/images/dashboard/sidenav/map-active.svg' : '/static/images/dashboard/sidenav/map.svg'} style={S('w-19 h-19')} />
            </NavItem>
          </LinkContainer>
          <NavItem className="main-nav" style={S('w-60 absolute t-5 r-80')} onClick={this.showIntercom}>
            <i className="fa fa-question" style={S('font-20 color-263445 absolute t-12 l-26 z-100')} />
            <i className="fa fa-comment" style={S('font-35 relative t-5n color-4D5C6C')} />
          </NavItem>
          <div style={S('w-20p absolute t-10 r-20n z-1')}>
            <ProfileImage data={data} user={user} />
          </div>
          <NavDropdown style={S('w-60 h-60 absolute b-0 r-0 z-2 bg-000')} title={title_area} dropup id="account-dropdown" className="account-dropdown account-dropdown--mobile" eventKey={3} noCaret>
            <li><a href="#" style={S('pointer')} onClick={this.showSettingsModal}><i className="fa fa-cog" style={S('mr-15')} />Settings</a></li>
            <li role="separator" className="divider" />
            <li><a href="/signout"><i className="fa fa-power-off" style={S('mr-15')} />Sign out</a></li>
          </NavDropdown>
          { recommend }
          { agents }
        </Nav>
        <Modal dialogClassName="modal-mobile" show={data.show_account_settings_modal} onHide={this.hideModal.bind(this)}>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <Modal.Header closeButton style={S('h-45 bc-f3f3f3')}>
              <Modal.Title style={S('font-14')}>Edit Account Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col xs={3} style={S('pl-0')}>
                <div className="pull-left">
                  { profile_image_area }
                </div>
              </Col>
              { form_fields }
            </Modal.Body>
            <Modal.Footer style={{ border: 'none' }}>
              <Col xs={9} style={S('pr-0 pull-right')}>
                { change_password_area }
                <Button bsStyle="link" onClick={this.hideModal.bind(this)}>Cancel</Button>
                <Button style={S('h-30 pt-5 pl-30 pr-30')} className={data.saving_account_settings ? 'disabled' : ''} type="submit" bsStyle="primary">
                  { data.saving_account_settings ? 'Saving...' : 'Save' }
                </Button>
              </Col>
            </Modal.Footer>
          </form>
        </Modal>
      </aside>
    )
  }
}
SideBar.propTypes = {
  data: React.PropTypes.object
}
