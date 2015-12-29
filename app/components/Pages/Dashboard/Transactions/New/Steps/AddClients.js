// Dashboard/Transactions/New/Steps/AddClients.js
import React, { Component } from 'react'

// Partials
import AddContactsForm from '../../../Partials/AddContactsForm'

export default class AddClients extends Component {

  render() {
    // Data
    const data = this.props.data
    return (
      <div>
        <h1>Very nice. New { data.new_transaction.type }. Who are we creating this <br/>transaction for?</h1>
        <AddContactsForm
          contact_type="client"
          data={ data }
          setContactActive={ this.props.setContactActive }
          setFilteredContacts={ this.props.setFilteredContacts }
          hideContactsForm={ this.props.hideContactsForm }
          addContact={ this.props.addContact }
          removeContact={ this.props.removeContact }
          showCreateContactModal={ this.props.showCreateContactModal }
          hideModal={ this.props.hideModal }
          createContact={ this.props.createContact }
        />
      </div>
    )
  }
}

// PropTypes
AddClients.propTypes = {
  data: React.PropTypes.object,
  setContactActive: React.PropTypes.func,
  setFilteredContacts: React.PropTypes.func,
  hideContactsForm: React.PropTypes.func,
  addContact: React.PropTypes.func,
  removeContact: React.PropTypes.func,
  showCreateContactModal: React.PropTypes.func,
  hideModal: React.PropTypes.func,
  createContact: React.PropTypes.func
}