// Dashboard.js
import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem, NavDropdown, Modal, Col, Input, Button, Alert } from 'react-bootstrap'
import S from 'shorti'
import Dropzone from 'react-dropzone'
import Loading from '../../../Partials/Loading'

// AppDispatcher
import AppDispatcher from '../../../../dispatcher/AppDispatcher'

// AppStore
import AppStore from '../../../../stores/AppStore'

// Partials
import ProfileImage from './ProfileImage'

export default class SideBar extends Component {

  showSettingsModal(e) {
    e.preventDefault()
    delete AppStore.data.error
    AppStore.data.show_account_settings_modal = true
    AppStore.emitChange()
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

  editAccountInfo() {
    const data = this.props.data
    const user = data.user
    const first_name = this.refs.first_name.refs.input.value.trim()
    const last_name = this.refs.last_name.refs.input.value.trim()
    const email = this.refs.email.refs.input.value.trim()
    const phone_number = this.refs.phone_number.refs.input.value.trim()
    const user_info = {
      first_name,
      last_name,
      email,
      phone_number
    }
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
    const old_password = this.refs.old_password.refs.input.value.trim()
    const new_password = this.refs.new_password.refs.input.value.trim()
    const new_password_confirm = this.refs.new_password_confirm.refs.input.value.trim()
    AppStore.data.saving_account_settings = true
    delete AppStore.data.error
    delete AppStore.data.password_changed
    AppStore.emitChange()
    // Check for values
    if (!old_password) {
      AppStore.data.error = {
        message: `You must add a password`
      }
      delete AppStore.data.saving_account_settings
      AppStore.emitChange()
      return
    }
    if (!new_password) {
      AppStore.data.error = {
        message: `You must add a new password`
      }
      delete AppStore.data.saving_account_settings
      AppStore.emitChange()
      return
    }
    // Check values match
    if (new_password !== new_password_confirm) {
      AppStore.data.error = {
        message: `Your passwords don't match`
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

  notificationIcon(name) {
    const data = this.props.data
    let icon
    if (data.notifications && data.notifications.summary[name] > 0) {
      icon = (
        <i className="fa fa-circle" style={ S('pl-10 font-8 color-3388FF') }></i>
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

  render() {
    // Data
    const data = this.props.data
    const sidebar_height = window.innerHeight
    const sidebar_style = S('w-70 fixed pl-8 t-0 z-100 bg-263445 h-' + sidebar_height)
    const path = data.path

    const active = {}
    if (path.indexOf('/dashboard/recents') !== -1)
      active.recents = 'active'

    if (path === '/dashboard/mls')
      active.mls = 'active'

    if (path.indexOf('/dashboard/contacts') !== -1)
      active.contacts = 'active'

    if (path === '/dashboard/tasks')
      active.tasks = 'active'

    if (path.indexOf('/dashboard/transactions') !== -1)
      active.transactions = 'active'

    if (path.indexOf('/dashboard/mls/listings/recommend') !== -1)
      active.recommend = 'active'

    // User info
    const user = data.user
    let recommend
    if (data.user.user_type === 'Brokerage') {
      recommend = (
        <LinkContainer className={ active.recommend } to="/dashboard/mls/listing/recommend">
          <NavItem style={ S('w-85p') }>
            <i className="fa fa-tasks"> </i>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Recommend
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
      <Dropzone onMouseLeave={ this.hidePicOverlay.bind(this) } onMouseEnter={ this.showPicOverlay.bind(this) } multiple={ false } onDrop={ this.uploadProfilePic.bind(this) } type="button" style={ dropzone_style }>
        <div className={ overlay_class } style={ S('pointer') }>
          <div style={ { ...S('absolute z-101 color-fff text-center t-40 w-100') } }>
            Edit picture
          </div>
          <div style={ { ...S('bg-100 br-100 absolute w-100 h-100 z-100 color-fff'), opacity: '.3' } }></div>
        </div>
        <ProfileImage
          size={ 100 }
          data={ data }
          user={ user }
          font={ 50 }
          top={ 15 }
        />
      </Dropzone>
    )
    if (data.uploading_profile_pic) {
      profile_image_area = (
        <div style={ S('absolute t-60n l-42') }>
          <Loading />
        </div>
      )
    }
    let change_password_area = (
      <a style={ S('mt-7') } className="pull-left" href="#" onClick={ this.showChangePassword.bind(this) }>Change password</a>
    )
    let form_fields = (
      <Col xs={ 9 } style={ S('p-0') }>
        <Col xs={ 6 }>
          <label>First name</label>
          <Input ref="first_name" type="text" defaultValue={ user.first_name }/>
        </Col>
        <Col xs={ 6 } style={ S('p-0') }>
          <label>Last name</label>
          <Input ref="last_name" type="text" defaultValue={ user.last_name }/>
        </Col>
        <Col xs={ 6 }>
          <label>Email</label>
          <Input ref="email" type="text" defaultValue={ user.email }/>
        </Col>
        <Col xs={ 6 } style={ S('p-0') }>
          <label>Phone number</label>
          <Input ref="phone_number" type="text" defaultValue={ user.phone_number ? user.phone_number.replace('+', '') : '' }/>
        </Col>
      </Col>
    )
    let message
    if (data.error) {
      message = (
        <Alert bsStyle="danger">
          { data.error.message }
        </Alert>
      )
    }
    if (data.password_changed) {
      message = (
        <Alert bsStyle="success">
          Success. Password changed.
        </Alert>
      )
    }
    if (data.show_change_password) {
      form_fields = (
        <Col xs={ 9 } style={ S('p-0') }>
          <Col xs={ 12 } style={ S('pr-0') }>
            <label>Current password</label>
            <Input key={'password'} ref="old_password" type="password" defaultValue=""/>
          </Col>
          <Col xs={ 12 } style={ S('pr-0') }>
            <label>New password</label>
            <Input key={'new_password'} ref="new_password" type="password" defaultValue=""/>
          </Col>
          <Col xs={ 12 } style={ S('pr-0') }>
            <label>Confirm new password</label>
            <Input key={'new_password_confirm'} ref="new_password_confirm" type="password" defaultValue=""/>
            { message }
          </Col>
        </Col>
      )
      change_password_area = (
        <a style={ S('mt-7') } className="pull-left" href="#" onClick={ this.hideChangePassword.bind(this) }>Cancel change password</a>
      )
    }
    return (
      <aside style={ sidebar_style } className="sidebar__nav-list pull-left">
        <div style={ S('mt-18') }>
          { /* <img src="/images/dashboard/icons/hamburger.svg"/> */ }
        </div>
        <Nav bsStyle="pills" stacked>
          <LinkContainer className={ active.recents } to="/dashboard/recents">
            <NavItem style={ S('w-85p') }>
              <img src={ active.recents ? '/images/dashboard/sidenav/chat-active.svg' : '/images/dashboard/sidenav/chat.svg' } style={ S('w-19 h-19') }/>
              {this.notificationIcon('room_notification_count')}
            </NavItem>
          </LinkContainer>
          <LinkContainer className={ active.mls } to="/dashboard/mls">
            <NavItem style={ S('w-85p') }>
              <img src={ active.mls ? '/images/dashboard/sidenav/map-active.svg' : '/images/dashboard/sidenav/map.svg' } style={ S('w-19 h-19') }/>
            </NavItem>
          </LinkContainer>
          { recommend }
          <LinkContainer className={ active.contacts } to="/dashboard/contacts">
            <NavItem style={ S('w-85p') }>
              <img src={ active.contacts ? '/images/dashboard/sidenav/people-active.svg' : '/images/dashboard/sidenav/people.svg' } style={ S('w-19 h-19') }/>
            </NavItem>
          </LinkContainer>
          <LinkContainer className={ active.tasks } to="/dashboard/tasks">
            <NavItem style={ S('w-85p') }>
              <img src={ active.tasks ? '/images/dashboard/sidenav/task-active.svg' : '/images/dashboard/sidenav/task.svg' } style={ S('w-19 h-19') }/>
              {this.notificationIcon('task_notification_count')}
            </NavItem>
          </LinkContainer>
          <LinkContainer className={ active.transactions } to="/dashboard/transactions" onClick={ this.props.viewAllTransactions }>
            <NavItem style={ S('w-85p') }>
              <img src={ active.transactions ? '/images/dashboard/sidenav/transactions-active.svg' : '/images/dashboard/sidenav/transactions.svg' } style={ S('w-19 h-19') }/>
              {this.notificationIcon('transaction_notification_count')}
            </NavItem>
          </LinkContainer>
        </Nav>
        <div style={ S('absolute b-20 l-20') }>
          <Nav className="sidebar__account">
            <div style={ S('absolute z-0') }>
              <ProfileImage data={ data } user={ user } />
            </div>
            <NavDropdown dropup id="account-dropdown" className="account-dropdown" eventKey={3} noCaret>
              <li><a href="#" style={ S('pointer') } onClick={ this.showSettingsModal }><i className="fa fa-cog" style={ S('mr-15') }></i>Settings</a></li>
              <li role="separator" className="divider"></li>
              <li><a href="/signout"><i className="fa fa-power-off" style={ S('mr-15') }></i>Sign out</a></li>
            </NavDropdown>
          </Nav>
        </div>
        <Modal show={ data.show_account_settings_modal } onHide={ this.hideModal.bind(this) }>
          <form onSubmit={ this.handleSubmit.bind(this) }>
            <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
              <Modal.Title style={ S('font-14') }>Edit Account Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col xs={ 3 }>
                <div className="pull-left">
                  { profile_image_area }
                </div>
              </Col>
              { form_fields }
            </Modal.Body>
            <Modal.Footer style={ { border: 'none' } }>
              <Col xs={ 9 } style={ S('pr-0 pull-right') }>
                { change_password_area }
                <Button bsStyle="link" onClick={ this.hideModal.bind(this) }>Cancel</Button>
                <Button style={ S('h-30 pt-5 pl-30 pr-30') } className={ data.saving_account_settings ? 'disabled' : '' } type="submit" bsStyle="primary">
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

// PropTypes
SideBar.propTypes = {
  data: React.PropTypes.object,
  viewAllTransactions: React.PropTypes.func
}