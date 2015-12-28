// AddContactsForm.js
import React, { Component } from 'react'
import { Button, Input } from 'react-bootstrap'
import S from 'shorti'

// Partials
import ProfileImage from './ProfileImage'

export default class AddContactsForm extends Component {

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

  filterContacts(e) {
    const text = this.refs.search_contacts.refs.input.value.trim()
    const text_lower = text.toLowerCase()
    const data = this.props.data
    const contacts = data.contacts
    let filtered_contacts = contacts.filter((contact) => {
      if (contact.first_name.toLowerCase().indexOf(text_lower) !== -1)
        return true
      if (contact.last_name.toLowerCase().indexOf(text_lower) !== -1)
        return true
      if (contact.phone_number && contact.phone_number.indexOf(text_lower) !== -1)
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

  navContactList(e) {
    if (e.which === 38)
      this.setContactActive('up')
    if (e.which === 40)
      this.setContactActive('down')
  }

  hideContactsForm() {
    this.props.hideContactsForm()
  }

  addContact(e) {
    e.preventDefault()
    // console.log('added contact!')
  }

  render() {
    const data = this.props.data
    let filtered_contacts
    if (data.filtered_contacts)
      filtered_contacts = data.filtered_contacts

    // Style
    const filter_scroll_style = {
      ...S('mt-10 p-5 bc-adadad bw-1 solid br-3'),
      maxHeight: 300,
      maxWidth: 600,
      overflow: 'scroll'
    }

    let search_contacts
    if (filtered_contacts) {
      search_contacts = (
        <div style={ filter_scroll_style }>
          {
            filtered_contacts.map((contact, i) => {
              let active_contact_style = ''
              const active_contact = data.active_contact
              if (active_contact === i)
                active_contact_style = ' bg-EDF7FD'
              return (
                <div onClick={ this.addContact.bind(this) } key={ 'contact-' + contact.id } style={ S('relative h-60 pointer mb-5 p-10' + active_contact_style) }>
                  <ProfileImage profile_image_url={ contact.profile_image_url }/>
                  <div style={ S('ml-50') }>
                    <span style={ S('fw-600') }>{ contact.first_name } { contact.last_name }</span><br />
                    <span style={ S('color-666') }>{ contact.contact_user.user_type }</span>
                  </div>
                  <div className="clearfix"></div>
                </div>
              )
            })
          }
        </div>
      )
    }

    return (
      <div>
        <form onSubmit={ this.addContact.bind(this) } style={ S('maxw-820') }>
          <Input ref="search_contacts" onBlur={ this.hideContactsForm.bind(this) } onKeyDown={ this.navContactList.bind(this) } onKeyUp={ this.filterContacts.bind(this) } className="pull-left" style={ S('w-600') } type="text" placeholder="Enter any name, email or phone number"/>
          <span className="pull-left" style={ S('w-30 ml-15 mt-8') }>OR</span>
          <Button className="pull-left" style={ S('w-160') } bsStyle="primary" type="button">Add New Contact</Button>
        </form>
        <div className="clearfix"></div>
        { search_contacts }
      </div>
    )
  }
}

// PropTypes
AddContactsForm.propTypes = {
  data: React.PropTypes.object,
  filterContacts: React.PropTypes.func,
  setContactActive: React.PropTypes.func,
  navContactList: React.PropTypes.func,
  setFilteredContacts: React.PropTypes.func,
  hideContactsForm: React.PropTypes.func
}