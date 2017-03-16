// Sidebar.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem, NavDropdown, Modal, Col, FormControl, Button, Alert, OverlayTrigger, Popover, DropdownButton, MenuItem } from 'react-bootstrap'
import S from 'shorti'
import _ from 'lodash'
import Dropzone from 'react-dropzone'
import Loading from '../../../Partials/Loading'
import MaskedInput from 'react-input-mask'
import { all_countries } from '../../../../utils/country-data'
import helpers from '../../../../utils/helpers'
import { PhoneNumberUtil } from 'google-libphonenumber'
const phoneUtil = PhoneNumberUtil.getInstance()
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import AppStore from '../../../../stores/AppStore'
import ProfileImage from './ProfileImage'
import SvgChat from './Svgs/Chat'
import SvgMap from './Svgs/Map'
import SvgStore from './Svgs/Store'
import Brand from '../../../../controllers/Brand'

export default class SideBar extends Component {

  componentDidUpdate() {
    // Refresh page on agent update
    const data = this.props.data
    if (data.settings && data.settings.is_agent)
      window.location.href = '/signin?message=account-upgraded'
  }
  showSettingsModal(e) {
    e.preventDefault()
    delete AppStore.data.error
    AppStore.data.show_account_settings_modal = true
    delete AppStore.data.phone_country
    AppStore.emitChange()
  }

  showIntercom() {
    AppStore.data.show_intercom = true
    AppStore.emitChange()
    window.Intercom('show')
  }

  hideIntercom() {
    delete AppStore.data.show_intercom
    AppStore.emitChange()
    window.Intercom('hide')
  }

  handleSubmit(type, e) {
    e.preventDefault()
    const data = this.props.data
    if (type === 'edit-info') {
      if (data.show_change_password)
        this.changePassword()
      else
        this.editAccountInfo()
    }
    if (type === 'search-agent')
      this.searchAgent()
    if (type === 'confirm-agent')
      this.confirmAgent()
  }

  searchAgent() {
    delete AppStore.data.errors
    AppStore.data.submitting = true
    AppStore.emitChange()
    const mlsid = this.mlsidInput.value.trim()
    AppDispatcher.dispatch({
      action: 'search-agent-settings',
      mlsid
    })
  }

  confirmAgent() {
    delete AppStore.data.errors
    AppStore.data.submitting = true
    AppStore.emitChange()
    const data = this.props.data
    const user = data.user
    const secret = this.secretInput.value.trim()
    const agent = data.settings.agent.id
    AppDispatcher.dispatch({
      action: 'upgrade-account',
      user,
      agent,
      secret
    })
  }

  editAccountInfo() {
    delete AppStore.data.error
    const data = this.props.data
    const user = data.user
    const first_name = this.first_nameInput.value.trim()
    const last_name = this.last_nameInput.value.trim()
    const email = this.emailInput.value.trim()
    const phone_number_input = this.phone_numberInput.value.replace(/\D/g, '').trim()
    let country_code = 1
    if (data.phone_country)
      country_code = data.phone_country.dialCode
    const phone_number = '+' + country_code + phone_number_input
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
    let old_password
    let new_password
    if (this.refs.old_password)
      old_password = this.old_passwordInput.value.trim()
    if (this.refs.new_password)
      new_password = this.new_passwordInput.value.trim()
    AppStore.data.saving_account_settings = true
    delete AppStore.data.error
    delete AppStore.data.password_changed
    AppStore.emitChange()
    // Check for values
    if (!old_password) {
      AppStore.data.error = {
        message: `You must add a password.`
      }
      delete AppStore.data.saving_account_settings
      AppStore.emitChange()
      return
    }
    if (!new_password) {
      AppStore.data.error = {
        message: `You must add a new password.`
      }
      delete AppStore.data.saving_account_settings
      AppStore.emitChange()
      return
    }
    if (new_password === old_password) {
      AppStore.data.error = {
        message: `You must add a different password from your current password.`
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

  showUpgradeAccountModal() {
    AppStore.data.show_upgrade_account_modal = true
    AppStore.emitChange()
  }

  hideModal() {
    delete AppStore.data.show_account_settings_modal
    delete AppStore.data.uploading_profile_pic
    delete AppStore.data.show_change_password
    delete AppStore.data.saving_account_settings
    delete AppStore.data.password_changed
    delete AppStore.data.show_upgrade_account_modal
    AppStore.emitChange()
    setTimeout(() => {
      delete AppStore.data.settings
      delete AppStore.data.errors
      AppStore.emitChange()
    }, 500)
  }

  notificationIcon(name) {
    const data = this.props.data
    let icon
    if (data.notifications && data.notifications.summary && data.notifications.summary[name] > 0) {
      icon = (
        <div style={ S('pl-10 absolute t-0 r-0') }>
          <div style={ S('font-15 bg-db3821 br-100 p-6 h-17 text-center') }>
            <span style={ S('color-fff font-10 relative t-9n') }>
              { data.notifications.summary.room_notification_count }
            </span>
          </div>
        </div>
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
    if (data.current_listing)
      this.hideListingViewer()
  }
  toggleShowPassword() {
    if (!AppStore.data.settings)
      AppStore.data.settings = {}
    if (!AppStore.data.settings.show_password)
      AppStore.data.settings.show_password = true
    else
      delete AppStore.data.settings.show_password
    AppStore.emitChange()
  }
  goToStore() {
    window.location = '/dashboard/website'
  }
  render() {
    // Data
    const data = this.props.data

    if (!data.user) {
      return false
    }

    let sidebar_height = 0
    if (typeof window !== 'undefined')
      sidebar_height = window.innerHeight
    const sidebar_style = S('w-70 fixed pl-8 t-0 z-100 bg-202A33 h-' + sidebar_height)
    const path = data.path

    const active = {}
    if (path.indexOf('/dashboard/recents') !== -1)
      active.recents = 'active'
    if (path.indexOf('/dashboard/mls') !== -1)
      active.mls = 'active'

    if (path.indexOf('/dashboard/contacts') !== -1)
      active.contacts = 'active'

    if (path === '/dashboard/tasks')
      active.tasks = 'active'

    if (path.indexOf('/dashboard/transactions') !== -1)
      active.transactions = 'active'

    if (path.indexOf('/dashboard/mls/listings/recommend') !== -1)
      active.recommend = 'active'

    if (path.indexOf('/dashboard/mls/agents') !== -1)
      active.agents = 'active'

    if (path.indexOf('/dashboard/website') !== -1)
      active.store = 'active'

    if (path.indexOf('/dashboard/deals') !== -1)
      active.deals = 'active'

    // User info
    const user = data.user
    let recommend
    if (data.user.user_type === 'Brokerage') {
      recommend = (
        <LinkContainer className={ active.recommend } to="/dashboard/mls/listing/recommend">
          <NavItem style={ S('w-85p') }>
            <i className="fa fa-tasks"> </i>
          </NavItem>
        </LinkContainer>
      )
    }

    let agents
    if (data.user.user_type === 'Brokerage') {
      agents = (
        <LinkContainer className={ active.agents } to="/dashboard/mls/agents">
          <NavItem style={ S('w-85p') }>
            <i className="fa fa-group"> </i>
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
    const phone_number_parsed = helpers.parsePhoneNumber(user.phone_number)
    const current_country_code = phone_number_parsed.country_code
    let phone_country = '+' + current_country_code
    if (data.phone_country)
      phone_country = `+${data.phone_country.dialCode}`
    const country_codes = (
      <DropdownButton title={ phone_country } id="input-dropdown-country-codes" style={ S('pb-9') }>
        <MenuItem key={ 1 } onClick={ this.handleCountryCodeSelect.bind(this, _.find(all_countries, { iso2: 'us' })) }>United States +1</MenuItem>
        {
          all_countries.map((country, i) => {
            if (country.dialCode !== 1)
              return <MenuItem onClick={ this.handleCountryCodeSelect.bind(this, country) } key={ country.iso2 + country.dialCode + i }>{ country.name } +{ country.dialCode }</MenuItem>
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
      <Col xs={ 9 } style={ S('p-0') }>
        <Col xs={ 6 }>
          <label>First name</label>
          <FormControl inputRef={ ref => this.first_nameInput = ref } type="text" defaultValue={ user.first_name }/>
        </Col>
        <Col xs={ 6 } style={ S('p-0') }>
          <label>Last name</label>
          <FormControl inputRef={ ref => this.last_nameInput = ref } type="text" defaultValue={ user.last_name }/>
        </Col>
        <Col xs={ 6 }>
          <label>Email</label>
          <FormControl inputRef={ ref => this.emailInput = ref } type="text" defaultValue={ user.email }/>
        </Col>
        <Col xs={ 6 } style={ S('p-0') }>
          <label>Phone number</label>
          <div className="input-group">
            <div className="input-group-btn input-dropdown--country-codes">
              { country_codes }
            </div>
            <MaskedInput className="form-control" ref={ ref => this.phone_numberInput = ref } type="text" defaultValue={ user.phone_number ? phone_number_parsed.phone_number : '' } mask="(999)-999-9999" maskChar="_"/>
          </div>
        </Col>
        <div className="clearfix"></div>
        <Col style={ S('pr-0') } xs={ 12 }>{ message }</Col>
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
        <Col xs={ 9 } style={ S('p-0') }>
          <Col xs={ 12 } style={ S('pr-0') }>
            <label>Current password</label>
            <FormControl key="old_password" bsSize="large" style={ S('font-15') } inputRef={ ref => this.old_passwordInput = ref } type="password" placeholder="Current password" />
          </Col>
          <Col xs={ 12 } style={ S('pr-0') }>
            <label>New password</label>
            <div style={ S('relative') }>
              <FormControl key="new_password" inputRef={ ref => this.new_passwordInput = ref } autoComplete={ false } style={ S('font-15') } bsSize="large" placeholder="New Password" type={ data.settings && data.settings.show_password ? 'text' : 'password' } />
              <i onClick={ this.toggleShowPassword } style={ S('absolute t-15 r-15 z-100 pointer color-666') } className={ `fa fa-eye${ data.settings && data.settings.show_password ? '-slash' : '' }` }></i>
            </div>
          </Col>
          <Col style={ S('pr-0') } xs={ 12 }>{ message }</Col>
        </Col>
      )
      change_password_area = ''
    }
    const title_area = (
      <div>&nbsp;</div>
    )
    const popover = {
      conversation: <Popover className="sidenav__popover" id="popover-conversations">Conversations</Popover>,
      map: <Popover className="sidenav__popover" id="popover-listing">Listings</Popover>,
      people: <Popover className="sidenav__popover" id="popover-people">People</Popover>,
      tasks: <Popover className="sidenav__popover" id="popover-tasks">Tasks</Popover>,
      concierge: <Popover className="sidenav__popover" id="popover-tasks">Concierge</Popover>,
      deals: <Popover className="sidenav__popover" id="popover-tasks">Deals</Popover>,
      transactions: <Popover className="sidenav__popover" id="popover-transactions">Transactions</Popover>,
      support: <Popover className="sidenav__popover" id="popover-transactions">Need Help?</Popover>,
      store: <Popover className="sidenav__popover" id="popover-transactions">Store</Popover>
    }
    if (data.errors && data.errors.type && data.errors.type === 'agent-not-found') {
      message = (
        <Alert bsStyle="danger">
          Agent not found.
        </Alert>
      )
    }
    let upgrade_account_area = (
      <div>
        <form onSubmit={ this.handleSubmit.bind(this, 'search-agent') }>
          <Modal.Body>
            <Col xs={ 12 }>
              <label>Enter your agent license # to unlock MLS features.</label>
              <FormControl key={'password'} inputRef={ ref => this.mlsidInput = ref } type="text" defaultValue=""/>
              { message }
              <div className="clearfix"></div>
            </Col>
            <div style={ S('text-center mt-20') }>
              Having trouble? <a href="#" onClick={ this.showIntercom }>Contact support</a>.
            </div>
          </Modal.Body>
          <Modal.Footer style={ { border: 'none' } }>
            <Col xs={ 9 } style={ S('pr-0 pull-right') }>
              <Button bsStyle="link" onClick={ this.hideModal.bind(this) }>Cancel</Button>
              <Button style={ S('h-30 pt-5 pl-30 pr-30') } className={ data.submitting ? 'disabled' : '' } type="submit" bsStyle="primary">
                { data.submitting ? 'Searching...' : 'Search' }
              </Button>
            </Col>
          </Modal.Footer>
        </form>
      </div>
    )
    if (data.settings && data.settings.agent) {
      if (data.errors && data.errors.update_error) {
        message = (
          <Alert bsStyle="danger">
            Agent information invalid.
          </Alert>
        )
      }
      const agent = data.settings.agent
      upgrade_account_area = (
        <div>
          <form onSubmit={ this.handleSubmit.bind(this, 'confirm-agent') }>
            <Modal.Body>
              <div className="tk-calluna-sans" style={ S('color-cecdcd mb-20 font-26 text-left') }>Rechat</div>
              <div style={ S('color-000 mb-20 text-left font-26') }>Confirm agent status</div>
              <div style={ S('mb-20 color-9b9b9b') }>We found the following contact details associated with agent license <strong>#{ data.settings.agent.mlsid }</strong></div>
              <div style={ S('mb-10 color-9b9b9b') }>Confirm this is you by entering your email or phone number # below</div>
              <div style={ S('mb-20 color-4a4a4a') }>
                {
                  agent.secret_questions.map((question, i) => {
                    return (
                      <div key={ 'question-' + i } style={ S('fw-600') }>{ question }</div>
                    )
                  })
                }
              </div>
              <div style={ S('w-100p mb-10') }>
                <FormControl type="text" inputRef={ ref => this.secretInput = ref } placeholder="Your email or phone #"/>
                <div className="clearfix"></div>
                { message }
              </div>
              <div style={ S('text-center mt-20') }>
                Having trouble? <a href="#" onClick={ this.showIntercom }>Contact support</a>.
              </div>
            </Modal.Body>
            <Modal.Footer style={ { border: 'none' } }>
              <Col xs={ 9 } style={ S('pr-0 pull-right') }>
                <Button bsStyle="link" onClick={ this.hideModal.bind(this) }>Cancel</Button>
                <Button style={ S('h-30 pt-5 pl-30 pr-30') } className={ data.submitting ? 'disabled' : '' } type="submit" bsStyle="primary">
                  { data.submitting ? 'Confirming...' : 'Confirm I\'m an agent' }
                </Button>
              </Col>
            </Modal.Footer>
          </form>
        </div>
      )
    }
    let upgrade_account_button
    if (data.user && data.user.user_type === 'Client') {
      upgrade_account_button = (
        <li><a href="#" style={ S('pointer') } onClick={ this.showUpgradeAccountModal }><i className="fa fa-arrow-up" style={ S('mr-15') }></i>Upgrade Account</a></li>
      )
    }

    let branding_logo
    if (Brand.asset('site_logo')) {
      branding_logo = (
        <div style={ S('mb-10 mt-10') }>
          <a target="_blank" href="http://www.claystapp.com">
            <div style={ S(`bg-url(${Brand.asset('site_logo')}) bg-cover bg-center w-30 h-30 ml-10 br-3`) }></div>
          </a>
        </div>
      )
    }
    const nav_active_color = '#' + Brand.color('primary', '3388ff')
    let close_intercom
    if (data.show_intercom) {
      let close_btn_style = S('fixed w-50 h-50 bg-fff r-20 b-30 br-100 text-center pt-5 pointer font-50')
      close_btn_style = {
        ...close_btn_style,
        lineHeight: '32px',
        boxShadow: '0 2px 13px 0 rgba(0, 0, 0, 0.15)'
      }
      close_intercom = (
        <div onClick={ this.hideIntercom } style={ close_btn_style }>
          &times;
        </div>
      )
    }
    const payments_link = <li><Link to="/dashboard/cards"><i className="fa fa-money" style={ S('mr-15') }></i>Payment Info</Link></li>
    let form_link = ''

    if (user.user_type === 'Admin')
      form_link = <li><Link to="/dashboard/forms"><i className="fa fa-wpforms" style={ S('mr-15') }></i>Forms</Link></li>

    return (
      <aside style={ sidebar_style } className="sidebar__nav-list pull-left">
        <Nav bsStyle="pills" stacked style={ S('mt-10') }>
          { branding_logo }
          <OverlayTrigger placement="right" overlay={ popover.conversation } delayShow={ 200 } delayHide={ 0 }>
            <LinkContainer onClick={ this.handleChatNavClick.bind(this) } className={ active.recents } to="/dashboard/recents">
              <NavItem style={ S('w-85p') }>
                <SvgChat color={ active.recents ? nav_active_color : '#4e5c6c' }/>
                {this.notificationIcon('room_notification_count')}
              </NavItem>
            </LinkContainer>
          </OverlayTrigger>
          <OverlayTrigger placement="right" overlay={ popover.map } delayShow={ 200 } delayHide={ 0 }>
            <LinkContainer onClick={ this.hideListingViewer.bind(this) } className={ active.mls } to="/dashboard/mls">
              <NavItem style={ S('w-85p') }>
                <SvgMap color={ active.mls ? nav_active_color : '#4e5c6c' }/>
              </NavItem>
            </LinkContainer>
          </OverlayTrigger>

          {
            user.features && user.features.indexOf('Concierge') > -1 &&
            <OverlayTrigger placement="right" overlay={ popover.concierge } delayShow={ 200 } delayHide={ 0 }>
              <LinkContainer onClick={ this.hideListingViewer.bind(this) } className={ active.concierge } to="/dashboard/concierge/deals">
                <NavItem style={ S('w-85p') }>
                  <img src={ active.concierge ? '/static/images/dashboard/sidenav/deals-active.svg' : '/static/images/dashboard/sidenav/deals.svg' } style={ S('w-19 h-19') }/>
                </NavItem>
              </LinkContainer>
            </OverlayTrigger>
          }

          {
            user.features && user.features.indexOf('Deals') > -1 &&
            <OverlayTrigger placement="right" overlay={ popover.deals } delayShow={ 200 } delayHide={ 0 }>
              <LinkContainer onClick={ this.hideListingViewer.bind(this) } className={ active.deals } to="/dashboard/deals">
                <NavItem style={ S('w-85p') }>
                  <img src={ active.deals ? '/static/images/dashboard/sidenav/deals-active.svg' : '/static/images/dashboard/sidenav/deals.svg' } style={ S('w-19 h-19') }/>
                </NavItem>
              </LinkContainer>
            </OverlayTrigger>
          }

          { /*
            <OverlayTrigger placement="right" overlay={ popover.people } delayShow={ 200 } delayHide={ 0 }>
              <LinkContainer className={ active.contacts } to="/dashboard/contacts">
                <NavItem style={ S('w-85p') }>
                  <img src={ active.contacts ? '/static/images/dashboard/sidenav/people-active.svg' : '/static/images/dashboard/sidenav/people.svg' } style={ S('w-19 h-19') }/>
                </NavItem>
              </LinkContainer>
            </OverlayTrigger>
            */
          }
          { /*
            <OverlayTrigger placement="right" overlay={ popover.tasks } delayShow={ 200 } delayHide={ 0 }>
              <LinkContainer className={ active.tasks } to="/dashboard/tasks">
                <NavItem style={ S('w-85p') }>
                  <img src={ active.tasks ? '/static/images/dashboard/sidenav/task-active.svg' : '/static/images/dashboard/sidenav/task.svg' } style={ S('w-19 h-19') }/>
                  {this.notificationIcon('task_notification_count')}
                </NavItem>
              </LinkContainer>
            </OverlayTrigger>
            <OverlayTrigger placement="right" overlay={ popover.transactions } delayShow={ 200 } delayHide={ 0 }>
              <LinkContainer className={ active.transactions } to="/dashboard/transactions" onClick={ this.props.viewAllTransactions }>
                <NavItem style={ S('w-85p') }>
                  <img src={ active.transactions ? '/static/images/dashboard/sidenav/transactions-active.svg' : '/static/images/dashboard/sidenav/transactions.svg' } style={ S('w-19 h-19') }/>
                  {this.notificationIcon('transaction_notification_count')}
                </NavItem>
              </LinkContainer>
            </OverlayTrigger>
            */
          }
          { recommend }
          { agents }
          {
            data.user.user_type && data.user.user_type === 'Agent' &&
            <OverlayTrigger placement="right" overlay={ popover.store } delayShow={ 200 } delayHide={ 0 }>
              <NavItem style={ S('w-85p') } onClick={ this.goToStore.bind(this) }>
                <SvgStore color={ active.store ? nav_active_color : '#4e5c6c' }/>
              </NavItem>
            </OverlayTrigger>
          }
        </Nav>
        <div style={ S('absolute b-10 l-15') }>
          <Nav className="sidebar__account">
            <OverlayTrigger placement="right" overlay={ popover.support } delayShow={ 200 } delayHide={ 0 }>
              <div style={ S('pointer relative t-15n') } onClick={ this.showIntercom }>
                <i className="fa fa-question" style={ S('font-20 color-202A33 relative t-5n l-13 z-100') }></i>
                <i className="fa fa-comment" style={ S('font-35 relative l-10n color-4D5C6C') }></i>
              </div>
            </OverlayTrigger>
            <div style={ S('absolute z-0 l-3n') }>
              <ProfileImage data={ data } user={ user } />
            </div>
            <NavDropdown style={ S('z-1000') } title={ title_area } dropup id="account-dropdown" className="account-dropdown" eventKey={3} noCaret>
              { upgrade_account_button }
              <li><a href="#" style={ S('pointer') } onClick={ this.showSettingsModal }><i className="fa fa-cog" style={ S('mr-15') }></i>Settings</a></li>
              { payments_link }
              { form_link }
              <li role="separator" className="divider"></li>
              <li><a href="/signout"><i className="fa fa-power-off" style={ S('mr-15') }></i>Sign out</a></li>
            </NavDropdown>
          </Nav>
        </div>
        <Modal show={ data.show_account_settings_modal } onHide={ this.hideModal.bind(this) }>
          <form onSubmit={ this.handleSubmit.bind(this, 'edit-info') }>
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
        <Modal show={ data.show_upgrade_account_modal } onHide={ this.hideModal.bind(this) }>
          <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
            <Modal.Title style={ S('font-14') }>Upgrade Account</Modal.Title>
          </Modal.Header>
          { upgrade_account_area }
        </Modal>
        { close_intercom }
      </aside>
    )
  }
}
SideBar.propTypes = {
  data: React.PropTypes.object,
  viewAllTransactions: React.PropTypes.func,
  location: React.PropTypes.object,
  history: React.PropTypes.object
}
