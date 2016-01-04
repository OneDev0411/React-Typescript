// Dashboard/Contacts/index.js
import React, { Component } from 'react'
import S from 'shorti'
import { Table, Button } from 'react-bootstrap'

// Partials
import MainNav from '../Partials/MainNav'
import SideBar from '../Partials/SideBar'
import ProfileImage from '../Partials/ProfileImage'
import Loading from '../../../Partials/Loading'

// AppDispatcher
import AppDispatcher from '../../../../dispatcher/AppDispatcher'

// AppStore
import AppStore from '../../../../stores/AppStore'

export default class Contacts extends Component {

  componentDidMount() {
    this.getContacts()
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

  render() {
    const data = this.props.data
    let contacts_table = <Loading />
    const contacts = AppStore.data.contacts
    if (contacts) {
      contacts_table = (
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Profile Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              contacts.map((contact) => {
                return (
                  <tr key={ 'contact-' + contact.id } style={ S('h-45') }>
                    <td><ProfileImage user={ contact }/></td>
                    <td>{ contact.first_name } { contact.last_name }</td>
                    <td>{ contact.email }</td>
                    <td>{ contact.phone_number }</td>
                    <td>
                      <Button className={ data.deleting_contact === contact.id ? 'disabled' : '' } bsStyle="danger" onClick={ this.deleteContact.bind(this, contact.id) }>
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

    // Style
    const main_style = S('absolute l-222 r-0')

    return (
      <div style={ S('minw-1000') }>
        <header>
          <MainNav data={ data }/>
        </header>
        <main>
          <SideBar data={ data }/>
          <div style={ main_style }>
            <div style={ S('ml-20') }>
              <h1>Contacts</h1>
              { contacts_table }
            </div>
          </div>
        </main>
      </div>
    )
  }
}

// PropTypes
Contacts.propTypes = {
  data: React.PropTypes.object
}