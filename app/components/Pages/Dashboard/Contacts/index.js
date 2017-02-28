// Dashboard/Contacts/index.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'
import { Table, Button, FormControl, DropdownButton, MenuItem, Alert } from 'react-bootstrap'
import MaskedInput from 'react-maskedinput'
import { all_countries } from '../../../../utils/country-data'
import helpers from '../../../../utils/helpers'
import { PhoneNumberUtil } from 'google-libphonenumber'
const phoneUtil = PhoneNumberUtil.getInstance()
import Header from '../Partials/Header'
import SideBar from '../Partials/SideBar'
import ProfileImage from '../Partials/ProfileImage'
import Loading from '../../../Partials/Loading'
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import AppStore from '../../../../stores/AppStore'
export default class Contacts extends Component {
  componentDidMount() {
    this.getContacts()
  }
  componentDidUpdate() {
    const data = this.props.data
    if (data.current_contact && this.props.location.pathname === '/dashboard/contacts') {
      delete AppStore.data.current_contact
      AppStore.emitChange()
    }
  }
  getContacts() {
    const data = this.props.data
    AppDispatcher.dispatch({
      action: 'get-contacts',
      user: data.user
    })
  }
  deleteContact(contact_id) {
    AppStore.data.deleting_contact = contact_id
    AppStore.emitChange()
    const data = this.props.data
    AppDispatcher.dispatch({
      action: 'delete-contact',
      user: data.user,
      contact_id
    })
  }
  handeContactClick(contact) {
    this.viewContact(contact)
  }
  addContactTab(contact) {
    const contact_tabs = AppStore.data.contact_tabs
    if (!contact_tabs)
      AppStore.data.contact_tabs = []
    AppStore.data.contact_tabs.push(contact)
    AppStore.emitChange()
  }
  viewContact(contact) {
    AppStore.data.current_contact = contact
    this.addContactTab(contact)
    const history = require('../../../../utils/history')
    history.replaceState(null, '/dashboard/contacts/' + contact.id)
    delete AppStore.data.phone_country
    delete AppStore.data.current_contact.temp_phone
    delete AppStore.data.error
    AppStore.emitChange()
  }
  removeContactTab(id) {
    // TODO Stay on current tab or go to all contact tab (after other tab click event triggered)
    setTimeout(() => {
      const contact_tabs = AppStore.data.contact_tabs
      const current_contact = AppStore.data.current_contact
      const reduced_contact_tabs = contact_tabs.filter(contact => {
        return contact.id !== id
      })
      AppStore.data.contact_tabs = reduced_contact_tabs
      if (current_contact.id === id)
        delete AppStore.data.current_contact
      const history = require('../../../../utils/history')
      history.replaceState(null, '/dashboard/contacts')
      AppStore.emitChange()
    }, 1)
  }
  handleContactSubmit(e) {
    e.preventDefault()
    delete AppStore.data.error
    AppStore.data.saving_contact = true
    AppStore.emitChange()
    const data = this.props.data
    const current_contact = data.current_contact
    const user = data.user
    const first_name = this.refs.first_name.refs.input.value
    const last_name = this.refs.last_name.refs.input.value
    const email = this.refs.email.refs.input.value
    const phone_number_input = this.refs.phone_number.refs.input.value.replace(/\D/g, '').trim()
    let country_code = 1
    if (data.phone_country)
      country_code = data.phone_country.dialCode
    const phone_number = '+' + country_code + phone_number_input
    if (phone_number_input && !phoneUtil.isPossibleNumberString(phone_number)) {
      AppStore.data.error = {
        message: 'You must use a valid phone number'
      }
      delete AppStore.data.saving_contact
      AppStore.emitChange()
      return
    }
    const contact = {
      id: current_contact.id,
      first_name,
      last_name,
      email
    }
    if (phone_number_input && phoneUtil.isPossibleNumberString(phone_number))
      contact.phone_number = phone_number
    AppDispatcher.dispatch({
      action: 'edit-contact',
      user,
      contact,
      module_type: 'contacts'
    })
  }
  handleCountryCodeSelect(country) {
    AppStore.data.phone_country = {
      iso2: country.iso2,
      dialCode: country.dialCode
    }
    AppStore.emitChange()
  }
  handleInputChange(ref) {
    if (ref !== 'phone_number')
      AppStore.data.current_contact[ref] = this.refs[ref].refs.input.value
    else {
      const temp_phone = this.refs[ref].refs.input.value
      AppStore.data.current_contact.temp_phone = temp_phone
    }
    AppStore.emitChange()
  }
  render() {
    const data = this.props.data
    let main_content = <Loading />
    const contacts = AppStore.data.contacts
    if (contacts) {
      main_content = (
        <Table className="contacts-table" style={ S('minw-760') } condensed hover>
          <thead>
            <tr>
              <th>Name</th>
              <th></th>
              <th>Email</th>
              <th>Phone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              contacts.map((contact) => {
                return (
                  <tr onClick={ this.handeContactClick.bind(this, contact) } className="contact-row" key={ 'contact-' + contact.id } style={ S('h-45 pointer') }>
                    <td width="50"><ProfileImage data={ data } user={ contact }/></td>
                    <td style={ S('pt-12') }>{ contact.first_name } { contact.last_name }</td>
                    <td style={ S('pt-12') }>{ contact.email }</td>
                    <td style={ S('pt-12') }>{ contact.phone_number }</td>
                    <td>
                      <Button className={ data.deleting_contact === contact.id ? 'disabled delete' : 'delete' } bsStyle="danger" onClick={ this.deleteContact.bind(this, contact.id) }>
                        { data.deleting_contact === contact.id ? 'Deleting...' : 'Delete' }
                      </Button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      )
    }

    if (data.current_contact) {
      const contact = data.current_contact
      let phone_number_parsed = {
        country_code: 1
      }
      if (contact.phone_number)
        phone_number_parsed = helpers.parsePhoneNumber(contact.phone_number)
      let phone_country = '+' + phone_number_parsed.country_code
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
      main_content = (
        <div style={ S('ml-20') }>
          <ProfileImage
            size={ 50 }
            font={ 24 }
            data={ data }
            user={ contact }
          />
          <div style={ S('ml-80 relative w-300') }>
            <form onSubmit={ this.handleContactSubmit.bind(this) }>
              <label>First name</label>
              <FormControl ref="first_name" type="text" value={ contact.first_name } onChange={ this.handleInputChange.bind(this, 'first_name') } />
              <label>Last name</label>
              <FormControl ref="last_name" type="text" value={ contact.last_name } onChange={ this.handleInputChange.bind(this, 'last_name') } />
              <label>Email</label>
              <FormControl ref="email" type="text" value={ contact.email } onChange={ this.handleInputChange.bind(this, 'email') } />
              <label>Phone number</label>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-btn input-dropdown--country-codes">
                    { country_codes }
                  </div>
                  <MaskedInput className="form-control" ref="phone_number" type="text" value={ contact.temp_phone ? contact.temp_phone : phone_number_parsed.phone_number } mask="(111)-111-1111" onChange={ this.handleInputChange.bind(this, 'phone_number') }/>
                </div>
              </div>
              { message }
              <Button style={ S('pl-30 pr-30 pull-right') } type="submit" className={ data.saving_contact ? 'disabled' : '' } bsStyle="primary">
                { data.saving_contact ? 'Saving...' : 'Save' }
              </Button>
            </form>
          </div>
        </div>
      )
    }
    const main_style = S('absolute l-70 r-0 pl-15 pr-15')
    return (
      <div style={ S('minw-1000') }>
        <Header
          data={ data }
          viewContact={ this.viewContact.bind(this) }
          removeContactTab={ this.removeContactTab }
        />
        <main style={ S('pt-20') }>
          <SideBar data={ data }/>
          <div style={ main_style }>
            { main_content }
          </div>
        </main>
      </div>
    )
  }
}
Contacts.propTypes = {
  data: React.PropTypes.object,
  location: React.PropTypes.object
}
