// Dashboard/Transactions/New/Steps/AddClients.js
import React, { Component } from 'react'
import S from 'shorti'

// Partials
import AddContactsModule from '../../../Modules/AddContacts'

export default class AddClients extends Component {

  render() {
    // Data
    const data = this.props.data
    return (
      <div>
        <div style={ S('t-100n absolute color-d0d4d9') }>Lost time is never found again.</div>
        <h1>Very nice. New { data.new_transaction.type }. Who are we creating this <br/>transaction for?</h1>
        <AddContactsModule
          module_type="client"
          data={ data }
          setContactActive={ this.props.setContactActive }
          setFilteredContacts={ this.props.setFilteredContacts }
          hideContactsForm={ this.props.hideContactsForm }
          addContact={ this.props.addContact }
          removeContact={ this.props.removeContact }
          showContactModal={ this.props.showContactModal }
          hideModal={ this.props.hideModal }
          createContact={ this.props.createContact }
          showNewContentInitials={ this.props.showNewContentInitials }
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
  showContactModal: React.PropTypes.func,
  hideModal: React.PropTypes.func,
  createContact: React.PropTypes.func,
  showNewContentInitials: React.PropTypes.func
}