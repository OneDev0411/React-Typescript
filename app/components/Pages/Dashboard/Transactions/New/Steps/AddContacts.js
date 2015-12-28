// Dashboard/Transactions/New/Steps/AddContacts.js
import React, { Component } from 'react'

// Partials
import AddContactsForm from '../../../Partials/AddContactsForm'

export default class AddContacts extends Component {

  render() {
    // Data
    const data = this.props.data

    return (
      <div>
        <h1>Very nice. New { data.new_transaction.type }. Who are we creating this <br/>transaction for?</h1>
        <AddContactsForm
          data={ data }
          setContactActive={ this.props.setContactActive }
          setFilteredContacts={ this.props.setFilteredContacts }
          hideContactsForm={ this.props.hideContactsForm }
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
  hideContactsForm: React.PropTypes.func
}