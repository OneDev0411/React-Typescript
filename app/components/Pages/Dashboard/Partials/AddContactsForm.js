// AddContactsForm.js
import React, { Component } from 'react'
import { Button, Input, Modal, Col, Alert } from 'react-bootstrap'
import S from 'shorti'
import validator from 'validator'
import helpers from '../../../../utils/helpers'

// Partials
import ProfileImage from './ProfileImage'

export default class AddContactsForm extends Component {

  componentDidUpdate() {
    const new_contact_created = this.props.data.new_contact_created
    if (new_contact_created) {
      this.refs.first_name.refs.input.value = ''
      this.refs.last_name.refs.input.value = ''
      this.refs.phone_number.refs.input.value = ''
      this.refs.email.refs.input.value = ''
      this.refs.company.refs.input.value = ''
      this.refs.role.refs.input.value = ''
    }
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
      if (active_contact < filtered_contacts.length - 1)
        active_contact = active_contact + 1
      else
        active_contact = 0
    }
    this.props.setContactActive(active_contact)
  }

  setContactFields(contact) {
    if (contact.first_name)
      this.refs.first_name.refs.input.value = contact.first_name
    if (contact.last_name)
      this.refs.last_name.refs.input.value = contact.last_name
    if (contact.phone_number)
      this.refs.phone_number.refs.input.value = contact.phone_number
    if (contact.email)
      this.refs.email.refs.input.value = contact.email
    if (contact.company)
      this.refs.company.refs.input.value = contact.company
    this.refs.first_name.refs.input.focus()
    this.showNewContentInitials()
  }

  filterContacts(e) {
    const text = this.refs.search_contacts.refs.input.value.trim()
    const text_lower = text.toLowerCase()
    const data = this.props.data
    const contacts = data.contacts
    let filtered_contacts = contacts.filter(contact => {
      if (contact.first_name && contact.first_name.toLowerCase().indexOf(text_lower) !== -1)
        return true
      if (contact.last_name && contact.last_name.toLowerCase().indexOf(text_lower) !== -1)
        return true
      if (contact.phone_number && contact.phone_number && contact.phone_number.indexOf(text_lower) !== -1)
        return false
      return false
    })
    if (!text_lower || !filtered_contacts.length)
      filtered_contacts = null
    this.props.setFilteredContacts(filtered_contacts)

    // Esc
    if (e.which === 27)
      this.props.hideContactsForm()
  }

  showContactModal(e) {
    e.preventDefault()
    this.props.showContactModal()
    setTimeout(() => {
      const search_input = this.refs.search_contacts.refs.input.value
      if (validator.isEmail(search_input))
        this.refs.email.refs.input.value = search_input
      if (helpers.isValidPhoneNumber(search_input))
        this.refs.phone_number.refs.input.value = search_input
      this.refs.action.value = 'create'
    }, 100)
  }

  showEditContactModal(contact) {
    this.props.showContactModal(contact)
    setTimeout(() => {
      this.refs.action.value = 'edit'
      this.setContactFields(contact)
    }, 100)
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
      this.showEditContactModal(contact)
    }
  }

  hideContactsForm() {
    this.props.hideContactsForm()
  }

  addContact(contact, module_type) {
    this.props.addContact(contact, module_type, this.refs.search_contacts.refs.input)
  }

  removeContact(contact_id, module_type) {
    this.props.removeContact(contact_id, module_type)
  }

  showNewContentInitials() {
    const first_initial = this.refs.first_name.refs.input.value.charAt(0)
    const last_initial = this.refs.last_name.refs.input.value.charAt(0)
    this.props.showNewContentInitials(first_initial, last_initial)
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
      overflow: 'scroll'
    }
    let module_style = S('relative')
    let search_contact_input_style = S('w-600')
    // If transaction
    if (module_type === 'transaction') {
      module_style = {
        ...module_style,
        ...S('w-500 ml-10 mr-10')
      }
      search_contact_input_style = S('w-270')
      filter_scroll_style.width = 475
    }
    // If task
    if (module_type === 'share-task') {
      module_style = {
        ...module_style,
        ...S('w-100p ml-10 mr-10')
      }
      search_contact_input_style = S('w-425')
      filter_scroll_style.width = 475
    }
    search_contact_input_style = {
      ...search_contact_input_style,
      ...S('mr-15')
    }

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
            <div className="add-contact-form__contact" onClick={ this.showEditContactModal.bind(this, contact) } key={ 'contact-' + contact.id } style={ S('br-3 relative h-60 pointer mb-5 p-10' + active_contact_style + contact_added_style) }>
              <ProfileImage user={ contact }/>
              <div style={ S('ml-50') }>
                <span style={ S('fw-600') }>{ contact.first_name } { contact.last_name }</span><br />
                <span style={ S('color-666') }>{ contact.contact_user ? contact.contact_user.user_type : '' }</span>
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
        <div className="add-contact-form__contacts" style={ filter_scroll_style }>
          { filtered_contacts_list }
        </div>
      )
    }

    let contacts_added_markup
    if (data.contacts_added && data.contacts_added[module_type]) {
      const contacts_added = data.contacts_added[module_type]
      contacts_added_markup = (
        contacts_added.map(contact => {
          return (
            <div style={ S('h-50 relative br-100 p-3 pl-0 pr-10 mb-10 mr-10 w-100p') } className="pull-left" key={ 'added-contact-' + contact.id }>
              <div style={ S('l-0 t-0 absolute') }>
                <ProfileImage top={11} size={40} user={ contact }/>
              </div>
              <div style={ S('ml-50') }>
                <div className="close pull-right" onClick={ this.removeContact.bind(this, contact.id, module_type) } style={ S('pointer') }>&times;</div>
                <div>{ contact.first_name } { contact.last_name }</div>
                <div>{ contact.email }</div>
              </div>
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

    const input_style = {
      border: 'none'
    }
    const row_style = {
      borderBottom: '1px solid #f3f3f3',
      marginLeft: '-15px',
      marginRight: '-15px'
    }
    const column_style = {
      paddingTop: '15px'
    }
    let first_initial
    let last_initial
    if (data.new_contact_modal && data.new_contact_modal.first_initial)
      first_initial = data.new_contact_modal.first_initial.toUpperCase()
    if (data.new_contact_modal && data.new_contact_modal.last_initial)
      last_initial = data.new_contact_modal.last_initial.toUpperCase()
    let contacts_added_area
    if (module_type !== 'transaction') {
      contacts_added_area = (
        <div style={ S('maxw-620 minh-35 mt-20') }>
          { contacts_added_markup }
          <div className="clearfix"></div>
        </div>
      )
    }
    return (
      <div style={ module_style } className="add-contact-form">
        <div style={ S('maxw-820') }>
          <form onSubmit={ this.showContactModal.bind(this) }>
            <Input ref="search_contacts" onKeyDown={ this.navContactList.bind(this) } onKeyUp={ this.filterContacts.bind(this) } className="pull-left" style={ search_contact_input_style } type="text" placeholder="Enter any name, email or phone number"/>
            <Button className="pull-left" style={ S('w-120') } bsStyle="primary" type="submit">
              Add
            </Button>
          </form>
        </div>
        <div className="clearfix"></div>
        { contacts_added_area }
        <div className="clearfix"></div>
        { filtered_contacts_markup }
        <Modal show={ data.show_contact_modal } onHide={ this.props.hideModal.bind(this) }>
          <form onSubmit={ this.props.addContact.bind(this, module_type) }>
            <Modal.Header closeButton style={ S('h-45 bc-f3f3f3') }>
              <Modal.Title style={ S('font-14') }>Add New Contact</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              { message }
              <div style={ row_style }>
                <Col xs={2}>
                  <div style={ S('absolute br-100 bg-dae9fd w-60 t-5n h-60 font-24 color-fff p-13 text-center') }>
                    <b>{ first_initial }{ last_initial }</b>
                  </div>
                </Col>
                <Col xs={5} style={ column_style }>
                  <Input style={ input_style } onKeyUp={ this.showNewContentInitials.bind(this) } type="text" ref="first_name" placeholder="FIRST NAME"/>
                </Col>
                <Col xs={5} style={ column_style }>
                  <Input style={ input_style } onKeyUp={ this.showNewContentInitials.bind(this) } type="text" ref="last_name" placeholder="LAST NAME"/>
                </Col>
                <div className="clearfix"></div>
              </div>
              <div style={ row_style }>
                <Col xs={2} style={ column_style }/>
                <Col xs={5} style={ column_style }>
                  <Input style={ input_style } type="text" ref="phone_number" placeholder="PHONE NUMBER"/>
                </Col>
                <Col xs={5} style={ column_style }>
                  <Input style={ input_style } type="text" ref="email" placeholder="EMAIL"/>
                </Col>
                <div className="clearfix"></div>
              </div>
              <div style={ row_style }>
                <Col xs={2} style={ column_style }/>
                <Col xs={5} style={ column_style }>
                  <Input style={ input_style } type="text" ref="company" placeholder="COMPANY"/>
                </Col>
                <Col xs={5} style={ column_style }>
                  <Input type="select" ref="role">
                    <option value="">Select a role</option>
                    <option value="Buyer agent">Buyer agent</option>
                    <option value="Co-buyer agent">Co-buyer agent</option>
                    <option value="Seller agent">Seller agent</option>
                    <option value="Buyer">Buyer</option>
                    <option value="Seller">Seller</option>
                    <option value="Title">Title</option>
                    <option value="Lawyer">Lawyer</option>
                    <option value="Lender">Lender</option>
                    <option value="Broker">Broker</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="Appraiser">Appraiser</option>
                    <option value="Inspector">Inspector</option>
                    <option value="Other">Other</option>
                  </Input>
                </Col>
                <div className="clearfix"></div>
              </div>
              <div className="clearfix"></div>
            </Modal.Body>
            <Modal.Footer style={ { border: 'none' } }>
              <Button bsStyle="link" onClick={ this.props.hideModal.bind(this) }>Cancel</Button>
              <Button style={ S('h-30 pt-5 pl-30 pr-30') } className={ data.creating_contacts ? 'disabled' : '' } type="submit" bsStyle="primary">
                { data.creating_contacts ? 'Adding...' : 'Add' }
              </Button>
            </Modal.Footer>
            <input type="hidden" ref="action"/>
          </form>
        </Modal>
      </div>
    )
  }
}

// PropTypes
AddContactsForm.propTypes = {
  data: React.PropTypes.object,
  filterContacts: React.PropTypes.func,
  setContactActive: React.PropTypes.func,
  setFilteredContacts: React.PropTypes.func,
  hideContactsForm: React.PropTypes.func,
  removeContact: React.PropTypes.func,
  showContactModal: React.PropTypes.func,
  hideModal: React.PropTypes.func,
  addContact: React.PropTypes.func,
  module_type: React.PropTypes.string,
  showNewContentInitials: React.PropTypes.func
}