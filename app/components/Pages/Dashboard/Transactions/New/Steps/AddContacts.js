// Dashboard/Transactions/New/Steps/AddContacts.js
import React, { Component } from 'react'
import S from 'shorti'

// Partials
import AddContactsForm from '../../../Partials/AddContactsForm'

export default class AddContacts extends Component {

  render() {
    // Data
    const data = this.props.data
    return (
      <div>
        <div style={ S('t-100n absolute color-d0d4d9') }>Never leave that till tomorrow which you can do today.</div>
        <h1>Invite your partner, vendors and even those on<br /> the other side of the negotiation!</h1>
        <AddContactsForm
          module_type="contact"
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
AddContacts.propTypes = {
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