// AddContactsModule/index.js
import React, { Component } from 'react'
import { Button, FormControl, Alert } from 'react-bootstrap'
import S from 'shorti'
import _ from 'lodash'
import validator from 'validator'
import helpers from '../../../../../utils/helpers'
import AppStore from '../../../../../stores/AppStore'
import AppDispatcher from '../../../../../dispatcher/AppDispatcher'
import ProfileImage from '../../Partials/ProfileImage'
export default class AddContactsModule extends Component {
  componentDidMount() {
    this.getContacts()
    setTimeout(() => {
      if (this.refs && this.props.module_type !== 'share-alert')
        this.refs.search_contacts.refs.input.focus()
    }, 300)
    delete AppStore.data.phone_country
    delete AppStore.data.error
    AppStore.emitChange()
  }
  componentDidUpdate() {
    const new_contact_created = this.props.data.new_contact_created
    if (new_contact_created) {
      this.first_nameInput.value = ''
      this.last_nameInput.value = ''
      this.phone_numberInput.value = ''
      this.emailInput.value = ''
      this.companyInput.value = ''
      this.roleInput.value = ''
    }
  }
  getContacts() {
    const user = this.props.data.user
    AppDispatcher.dispatch({
      action: 'get-contacts',
      user
    })
  }
  setFilteredContacts(filtered_contacts) {
    AppStore.data.filtered_contacts = filtered_contacts
    AppStore.emitChange()
  }
  hideContactsForm() {
    AppStore.data.filtered_contacts = null
    AppStore.emitChange()
  }
  removeContact(contact_id) {
    const module_type = this.props.module_type
    AppDispatcher.dispatch({
      action: 'remove-contact',
      contact_id,
      module_type
    })
  }
  showNewContentInitials() {
    const first_initial = this.first_nameInput.value.charAt(0)
    const last_initial = this.last_nameInput.value.charAt(0)
    AppStore.data.new_contact_modal = {
      first_initial,
      last_initial
    }
    AppStore.emitChange()
  }
  hideModal() {
    delete AppStore.data.show_contact_modal
    delete AppStore.data.contact_modal
    delete AppStore.data.creating_contacts
    delete AppStore.data.new_contact_modal
    AppStore.emitChange()
  }
  addContact(contact) {
    delete AppStore.data.error
    AppStore.emitChange()
    const module_type = this.props.module_type
    if (!AppStore.data.contacts_added)
      AppStore.data.contacts_added = {}
    if (!AppStore.data.contacts_added[module_type])
      AppStore.data.contacts_added[module_type] = []
    AppStore.data.contacts_added[module_type].unshift(contact)
    delete AppStore.data.filtered_contacts
    this.search_contactsInput.value = ''
    AppStore.emitChange()
  }
  setContactActive(direction) {
    const data = this.props.data
    const filtered_contacts = data.filtered_contacts
    let active_contact = -1
    // Prev active contact
    if (data.active_contact !== null)
      active_contact = data.active_contact

    if (direction === 'up') {
      if (active_contact > -1)
        active_contact = active_contact - 1
      else
        active_contact = filtered_contacts.length - 1
    }

    if (direction === 'down') {
      if (filtered_contacts && active_contact < filtered_contacts.length - 1)
        active_contact = active_contact + 1
      else
        active_contact = 0
    }
    AppStore.data.active_contact = active_contact
    AppStore.emitChange()
  }
  setContactFields(contact) {
    if (contact.first_name)
      this.first_nameInput.value = contact.first_name
    if (contact.last_name)
      this.last_nameInput.value = contact.last_name
    if (contact.email)
      this.emailInput.value = contact.email
    if (contact.company)
      this.companyInput.value = contact.company
    this.refs.first_name.refs.input.focus()
    this.showNewContentInitials()
    if (contact.phone_number) {
      const phone_number = helpers.parsePhoneNumber(contact.phone_number).phone_number
      AppStore.data.new_contact_modal.phone_number = phone_number
      AppStore.emitChange()
    }
  }
  filterContacts(e) {
    // No arrow keys
    if (e.which === 38 || e.which === 40)
      return
    const text = this.search_contactsInput.value.trim()
    const text_lower = text.toLowerCase()
    const data = this.props.data
    const contacts = data.contacts
    let filtered_contacts = contacts.filter(contact => {
      if (contact.first_name && contact.first_name.toLowerCase().indexOf(text_lower) !== -1)
        return true
      if (contact.last_name && contact.last_name.toLowerCase().indexOf(text_lower) !== -1)
        return true
      if (contact.email && contact.email.toLowerCase().indexOf(text_lower) !== -1)
        return true
      if (contact.phone_number && contact.phone_number && contact.phone_number.indexOf(text_lower) !== -1)
        return false
      return false
    })
    if (!text_lower || !filtered_contacts.length)
      filtered_contacts = null
    this.setFilteredContacts(filtered_contacts)

    // Esc
    if (e.which === 27)
      this.hideContactsForm()
    // Test for last item
    if (filtered_contacts && filtered_contacts.length === 1) {
      AppStore.data.active_contact = 0
      AppStore.emitChange()
    }
  }
  navContactList(e) {
    const filtered_contacts = this.props.data.filtered_contacts
    if (e.which === 38)
      this.setContactActive('up')
    if (e.which === 40)
      this.setContactActive('down')
    if (e.which === 13 && filtered_contacts) {
      const active_contact = this.props.data.active_contact
      const contact = filtered_contacts[active_contact]
      this.addContact(contact)
    }
    if (e.which === 13 && !filtered_contacts)
      this.createContactFromInput()
  }
  createContactFromInput() {
    delete AppStore.data.error
    AppStore.emitChange()
    const search_input = this.search_contactsInput.value
    // Check if contact phone or email
    let contact
    if (validator.isEmail(search_input)) {
      contact = {
        id: new Date().getTime(),
        type: 'email',
        email: search_input
      }
      this.addContact(contact)
    }
    if (helpers.isValidPhoneNumber(search_input)) {
      contact = {
        id: new Date().getTime(),
        type: 'phone_number',
        phone_number: search_input
      }
      this.addContact(contact)
    }
    if (!validator.isEmail(search_input) && !helpers.isValidPhoneNumber(search_input)) {
      AppStore.data.error = {
        message: 'You must add either a valid email address or valid phone number.'
      }
      AppStore.emitChange()
    }
  }
  handleButtonClick() {
    this.createContactFromInput()
  }
  handleCountryCodeSelect(country) {
    AppStore.data.phone_country = {
      iso2: country.iso2,
      dialCode: country.dialCode
    }
    AppStore.emitChange()
  }
  handleInputClick() {
    this.handleInputFocus()
  }
  handleInputFocus() {
    const data = this.props.data
    const contacts = data.contacts
    const module_type = this.props.module_type
    let contacts_added
    let contacts_added_ids
    if (data.contacts_added) {
      contacts_added = data.contacts_added[module_type]
      contacts_added_ids = _.map(contacts_added, 'id')
    }
    let filtered_contacts = contacts
    if (contacts) {
      if (contacts_added_ids) {
        filtered_contacts = contacts.filter(contact => {
          return contacts_added_ids.indexOf(contact.id) === -1
        })
      }
      this.setFilteredContacts(filtered_contacts)
    }
  }
  handleInputBlur() {
    // Wait for contact click
    setTimeout(() => {
      delete AppStore.data.filtered_contacts
      AppStore.emitChange()
    }, 100)
  }
  render() {
    const data = this.props.data
    const module_type = this.props.module_type
    let filtered_contacts
    if (data.filtered_contacts)
      filtered_contacts = data.filtered_contacts
    // Style
    const filter_scroll_style = {
      ...S('mt-10 p-5 bc-ccc bw-1 solid br-3 absolute t-35 z-100 bg-fff maxw-600 w-100p maxh-300'),
      overflowY: 'scroll'
    }
    let module_style = S('relative')
    let search_input_width = 'w-430'
    if (data.is_mobile)
      search_input_width = 'w-100p'
    let search_contact_input_style = S(search_input_width + ' mr-15')

    // If transaction edit
    if (module_type === 'transaction') {
      module_style = {
        ...module_style,
        ...S('w-500 ml-10 mr-10')
      }
      search_contact_input_style = S('w-270 mr-15')
      filter_scroll_style.width = 475
    }

    // If sharing a task or inviting to a room
    if (module_type === 'share-task' || module_type === 'room' || module_type === 'share-alert') {
      module_style = {
        ...module_style,
        ...S('w-100p')
      }
      search_contact_input_style = S(search_input_width + ' mr-15')
      filter_scroll_style.width = 475
    }
    if (data.is_mobile)
      filter_scroll_style.width = window.innerWidth - 50
    let filtered_contacts_list
    if (filtered_contacts) {
      filtered_contacts_list = filtered_contacts.map((contact, i) => {
        let active_contact_style = ''
        const contact_added_style = ''
        const active_contact = data.active_contact
        if (active_contact === i)
          active_contact_style = ' bg-EDF7FD'
        if (!contact.added) {
          return (
            <div className="add-contact-form__contact" onClick={ this.addContact.bind(this, contact) } key={ 'contact-' + contact.id } style={ S('br-3 relative h-60 pointer mb-5 p-10' + active_contact_style + contact_added_style) }>
              <ProfileImage data={ data } user={ contact }/>
              <div style={ S('ml-50') }>
                <span style={ S('fw-600') }>{ contact.first_name } { contact.last_name }</span>{ contact.contact_user ? ',' : '' }&nbsp;
                <span style={ S('color-666') }>{ contact.contact_user ? contact.contact_user.user_type : '' }</span><br />
                <span style={ S('color-666 font-13') }>{ contact.email ? contact.email : contact.phone_number }</span><br />
              </div>
              <div className="clearfix"></div>
            </div>
          )
        }
      })
      filtered_contacts_list = filtered_contacts_list.filter((n) => {
        return n !== undefined
      })
    }
    let filtered_contacts_markup
    if (filtered_contacts_list && filtered_contacts_list.length) {
      filtered_contacts_markup = (
        <div className="add-contact-form__contacts touch-scroll" style={ filter_scroll_style }>
          { filtered_contacts_list }
        </div>
      )
    }
    let contacts_added_markup
    if (data.contacts_added && data.contacts_added[module_type]) {
      const contacts_added = data.contacts_added[module_type]
      contacts_added_markup = (
        contacts_added.map(contact => {
          let contact_info
          if (!contact)
            return ''
          if (contact.type === 'contact') {
            contact_info = (
              <div>
                <div style={ S('l-0 t-0 absolute') }>
                  <ProfileImage data={ data } top={11} size={40} user={ contact }/>
                </div>
                <div style={ S('ml-50') }>
                  <div className="close pull-right" onClick={ this.removeContact.bind(this, contact.id) } style={ S('pointer') }>&times;</div>
                  <div>
                    <div>{ contact.first_name } { contact.last_name }</div>
                    <div>{ contact.email }</div>
                  </div>
                </div>
              </div>
            )
          }
          if (contact.type === 'email') {
            contact_info = (
              <div>
                <div>
                  <div className="close pull-right" onClick={ this.removeContact.bind(this, contact.id) } style={ S('pointer') }>&times;</div>
                  <div>
                    <div>{ contact.email }</div>
                  </div>
                </div>
              </div>
            )
          }
          if (contact.type === 'phone_number') {
            contact_info = (
              <div>
                <div>
                  <div className="close pull-right" onClick={ this.removeContact.bind(this, contact.id) } style={ S('pointer') }>&times;</div>
                  <div>
                    <div>{ contact.phone_number }</div>
                  </div>
                </div>
              </div>
            )
          }
          return (
            <div style={ S('h-50 relative p-3 pl-0 pr-10 mb-10 mr-10 w-100p') } className="pull-left" key={ 'added-contact-' + contact.id }>
              { contact_info }
            </div>
          )
        })
      )
    }
    let message
    if (data.new_contact_created) {
      message = (
        <Alert bsStyle="success">New contact created.</Alert>
      )
    }
    if (data.new_contact_modal && data.new_contact_modal.errors) {
      message = (
        <Alert bsStyle="danger">All fields are required.</Alert>
      )
    }
    if (data.new_contact_modal && data.new_contact_modal.email_invalid) {
      message = (
        <Alert bsStyle="danger">Email is invalid.</Alert>
      )
    }
    if (data.error) {
      message = (
        <Alert style={ S('mt-15') } bsStyle="danger">
          { data.error.message }
        </Alert>
      )
    }
    let contacts_added_area
    if (module_type !== 'transaction') {
      contacts_added_area = (
        <div style={ S('maxw-620 minh-35 mt-20') }>
          { contacts_added_markup }
          <div className="clearfix"></div>
        </div>
      )
    }
    let add_button_style = S('w-120')
    if (data.is_mobile)
      add_button_style = S('w-100p mt-10')
    return (
      <div style={ module_style } className="add-contact-form">
        <div style={ S('maxw-820') }>
          <FormControl onClick={ this.handleInputClick.bind(this) } onFocus={ this.handleInputFocus.bind(this) } onBlur={ this.handleInputBlur.bind(this) } inputRef={ ref => this.search_contactsInput = ref } onKeyDown={ this.navContactList.bind(this) } onKeyUp={ this.filterContacts.bind(this) } className="pull-left" style={ search_contact_input_style } type="text" placeholder="Enter any name, email or phone number"/>
          <Button className="pull-left" style={ add_button_style } bsStyle="primary" onClick={ this.handleButtonClick.bind(this) }>
            Add
          </Button>
        </div>
        <div className="clearfix"></div>
        { message }
        { contacts_added_area }
        <div className="clearfix"></div>
        { filtered_contacts_markup }
      </div>
    )
  }
}
AddContactsModule.propTypes = {
  data: React.PropTypes.object,
  module_type: React.PropTypes.string
}
