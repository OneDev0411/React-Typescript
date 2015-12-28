// Dashboard/Contacts/index.js
import React, { Component } from 'react'
import S from 'shorti'
import { Table } from 'react-bootstrap'

// Partials
import MainNav from '../Partials/MainNav'
import SideBar from '../Partials/SideBar'
import ProfileImage from '../Partials/ProfileImage'

// AppDispatcher
import AppDispatcher from '../../../../dispatcher/AppDispatcher'

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

  render() {
    const data = this.props.data
    let contacts
    if (data.contacts)
      contacts = data.contacts

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
              <Table striped bordered condensed hover>
                <thead>
                  <tr>
                    <th>Profile Image</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    contacts.map((contact) => {
                      return (
                        <tr key={ 'contact-' + contact.id }>
                          <td><ProfileImage profile_image_url={ contact.profile_image_url }/></td>
                          <td>{ contact.first_name } { contact.last_name }</td>
                          <td>{ contact.email }</td>
                          <td>{ contact.phone_number }</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </Table>
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