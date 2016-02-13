// Dashboard.js
import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem, NavDropdown, Modal, Col, Input, Button } from 'react-bootstrap'
import S from 'shorti'

// AppDispatcher
import AppDispatcher from '../../../../dispatcher/AppDispatcher'

// AppStore
import AppStore from '../../../../stores/AppStore'

// Partials
import ProfileImage from './ProfileImage'

export default class SideBar extends Component {

  componentWillMount() {
    AppDispatcher.dispatch({
      action: 'get-notification-summary',
      user: this.props.data.user
    })
  }

  showSettingsModal(e) {
    e.preventDefault()
    AppStore.data.show_account_settings_modal = true
    AppStore.emitChange()
  }

  handleSubmit(e) {
    e.preventDefault()
    const data = this.props.data
    const first_name = this.refs.first_name.refs.input.value.trim()
    const last_name = this.refs.last_name.refs.input.value.trim()
    const email = this.refs.email.refs.input.value.trim()
    const phone_number = this.refs.phone_number.refs.input.value.trim()
    const user = data.user
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

  hideModal() {
    delete AppStore.data.show_account_settings_modal
    AppStore.emitChange()
  }

  notificationIcon(name) {
    let icon;
    if (AppStore.data.notifications.summary[name] > 0) {
      icon = (
        <i className="fa fa-circle" style={ S('pl-10 font-8 color-3388FF') }></i>
      )
    }
    return icon;
  }

  render() {
    // Data
    const data = this.props.data
    const sidebar_height = window.innerHeight
    const sidebar_style = S('w-183 fixed pl-0 t-0 z-100 h-' + sidebar_height)
    const path = data.path

    const active = {}
    if (path.indexOf('/dashboard/recents') !== -1)
      active.recents = 'active'

    if (path === '/dashboard/mls')
      active.mls = 'active'

    if (path === '/dashboard/contacts')
      active.contacts = 'active'

    if (path === '/dashboard/tasks')
      active.tasks = 'active'

    if (path.indexOf('/dashboard/transactions') !== -1)
      active.transactions = 'active'

    if (path.indexOf('/dashboard/mls/listings/recommend') !== -1)
      active.recommend = 'active';

    // User info
    const user = data.user
    const first_name = user.first_name
    const last_name = user.last_name

    let recommend
    if (data.user.user_type === 'Brokerage') {
      recommend = (
        <LinkContainer className={ active.recommend } to="/dashboard/mls/listing/recommend">
          <NavItem style={ S('w-75p') }>
            <i className="fa fa-tasks"> </i>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Recommend
          </NavItem>
        </LinkContainer>
      )
    }

    return (
      <aside style={ sidebar_style } className="sidebar--dashboard pull-left bg-aqua">
        <div style={ S('mt-18') }>
          { /* <img src="/images/dashboard/icons/hamburger.svg"/> */ }
        </div>
        <Nav bsStyle="pills" stacked>
          <LinkContainer className={ active.recents } to="/dashboard/recents">
            <NavItem style={ S('w-78p') }>
              <img src={ active.recents ? '/images/dashboard/icons/sidenav/chat-active.svg' : '/images/dashboard/icons/sidenav/chat.svg' } style={ S('w-19 h-19') }/>
              &nbsp;&nbsp;&nbsp;&nbsp;Conversations
              {this.notificationIcon('room_notification_count')}
            </NavItem>
          </LinkContainer>
          <LinkContainer className={ active.mls } to="/dashboard/mls">
            <NavItem style={ S('w-75p') }>
              <img src={ active.mls ? '/images/dashboard/icons/sidenav/map-active.svg' : '/images/dashboard/icons/sidenav/map.svg' } style={ S('w-19 h-19') }/>
              &nbsp;&nbsp;&nbsp;&nbsp;Search
            </NavItem>
          </LinkContainer>
          { recommend }
          <LinkContainer className={ active.contacts } to="/dashboard/contacts">
            <NavItem style={ S('w-75p') }>
              <img src={ active.contacts ? '/images/dashboard/icons/sidenav/people-active.svg' : '/images/dashboard/icons/sidenav/people.svg' } style={ S('w-19 h-19') }/>
              &nbsp;&nbsp;&nbsp;&nbsp;People
            </NavItem>
          </LinkContainer>
          <LinkContainer className={ active.tasks } to="/dashboard/tasks">
            <NavItem style={ S('w-75p') }>
              <img src={ active.tasks ? '/images/dashboard/icons/sidenav/calendar-active.svg' : '/images/dashboard/icons/sidenav/calendar.svg' } style={ S('w-19 h-19') }/>
              &nbsp;&nbsp;&nbsp;&nbsp;Calendar
              {this.notificationIcon('task_notification_count')}
            </NavItem>
          </LinkContainer>
          <LinkContainer className={ active.transactions } to="/dashboard/transactions" onClick={ this.props.viewAllTransactions }>
            <NavItem style={ S('w-80p') }>
              <img src={ active.transactions ? '/images/dashboard/icons/sidenav/transactions-active.svg' : '/images/dashboard/icons/sidenav/transactions.svg' } style={ S('w-19 h-19') }/>
              &nbsp;&nbsp;&nbsp;&nbsp;Transactions
              {this.notificationIcon('transaction_notification_count')}
            </NavItem>
          </LinkContainer>
        </Nav>
        <div style={ S('absolute b-20 l-20') }>
          <Nav>
            <div style={ S('absolute z-0') }>
              <ProfileImage data={ data } user={ user } />
            </div>
            <NavDropdown dropup id="main-nav-dropdown" className="main-nav-dropdown--account" eventKey={3} title={ first_name + ' ' + last_name }>
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
                  <ProfileImage
                    size={ 100 }
                    data={ data }
                    user={ user }
                    font={ 50 }
                    top={ 15 }
                  />
                </div>
              </Col>
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
            </Modal.Body>
            <Modal.Footer style={ { border: 'none' } }>
              <Button bsStyle="link" onClick={ this.hideModal.bind(this) }>Cancel</Button>
              <Button style={ S('h-30 pt-5 pl-30 pr-30') } className={ data.saving_account_settings ? 'disabled' : '' } type="submit" bsStyle="primary">
                { data.saving_account_settings ? 'Saving...' : 'Save' }
              </Button>
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