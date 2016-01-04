// Dashboard/Transactions/index.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Table, Button, Alert } from 'react-bootstrap'
import S from 'shorti'
import _ from 'lodash'

// AppStore
import AppStore from '../../../../stores/AppStore'

// AppDispatcher
import AppDispatcher from '../../../../dispatcher/AppDispatcher'

// TransactionDispatcher
import TransactionDispatcher from '../../../../dispatcher/TransactionDispatcher'

// Partials
import MainNav from '../Partials/MainNav'
import SideBar from '../Partials/SideBar'

// Helpers
import helpers from '../../../../utils/helpers'

export default class Transactions extends Component {

  componentDidMount() {
    this.getContacts()
    this.getTransactions()
    // If coming from redirect
    if (AppStore.data.new_transaction && AppStore.data.new_transaction.redirect_to) {
      setTimeout(() => {
        delete AppStore.data.new_transaction.redirect_to
        delete AppStore.data.new_transaction.saved
      }, 3000)
    }
  }

  getContacts() {
    const data = this.props.data
    AppDispatcher.dispatch({
      action: 'get-contacts',
      user: data.user
    })
  }

  getTransactions() {
    const data = this.props.data
    TransactionDispatcher.dispatch({
      action: 'get-all',
      user: data.user
    })
  }

  deleteTransaction(id) {
    const data = this.props.data
    const user = data.user
    AppStore.data.deleting_transaction = id
    AppStore.emitChange()
    TransactionDispatcher.dispatch({
      action: 'delete-transaction',
      user,
      id
    })
  }

  render() {
    // Data
    const data = this.props.data

    // Style
    const main_style = S('absolute l-222 r-0 pl-20 pr-20')

    // Transactions
    let transactions_rows
    if (data.transactions) {
      const transactions = data.transactions
      transactions_rows = transactions.map((transaction) => {
        let listing
        let list_agent_full_name
        let address
        // Price
        let contract_price = transaction.contract_price
        if (contract_price)
          contract_price = '$' + helpers.numberWithCommas(contract_price)
        // Dates
        const important_dates = transaction.important_dates
        let closing_date
        if (important_dates) {
          closing_date = _.result(_.findWhere(important_dates, { title: 'closing' }), 'due_date')
          closing_date = closing_date.toString()
          closing_date = closing_date.replace('T00:00:00.000Z','')
        }
        if (transaction.listing) {
          listing = transaction.listing
          list_agent_full_name = listing.list_agent_full_name
          address = listing.property.address.geo_source_formatted_address_google
        }
        let cover_image = <div style={ S('bg-333 h-70 w-100 color-fff text-center pt-22') }>No Image</div>
        if (listing && listing.cover_image_url) {
          cover_image = (
            <img style={ S('w-100') } src={ listing.cover_image_url } />
          )
        }
        let contacts_num
        if (transaction.contacts)
          contacts_num = transaction.contacts.length
        return (
          <tr key={ transaction.id }>
            <td>
              <div className="pull-left">{ cover_image }</div>
              <div className="pull-left" style={ S('ml-20 mt-15 maxw-200') }>{ address }</div>
            </td>
            <td>
              <div style={ S('ml-20 mt-20') }>
                { list_agent_full_name }
              </div>
            </td>
            <td>
              <div style={ S('ml-20 mt-20') }>
                { contract_price }
              </div>
            </td>
            <td>
              <div style={ S('ml-20 mt-20') }>
                { contacts_num }
              </div>
            </td>
            <td>...</td>
            <td>
              <div style={ S('ml-20 mt-20') }>
                { closing_date ? closing_date : 'TBD' }
              </div>
            </td>
            <td>
              <Button className={ data.deleting_transaction && data.deleting_transaction === transaction.id ? 'disabled' : '' } onClick={ this.deleteTransaction.bind(this, transaction.id) } type="button" bsStyle="danger">
                { data.deleting_transaction && data.deleting_transaction === transaction.id ? 'Deleting...' : 'Delete' }
              </Button>
            </td>
          </tr>
        )
      })
    }
    let saved_message
    if (data.new_transaction && data.new_transaction.saved) {
      saved_message = (
        <Alert bsStyle="success">Transaction saved!</Alert>
      )
    }

    let transactions_area
    if (transactions_rows && transactions_rows.length) {
      transactions_area = (
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th>Property</th>
              <th>Contact</th>
              <th>Price</th>
              <th>Contacts</th>
              <th>Next Task</th>
              <th>Closing Date</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            { transactions_rows }
          </tbody>
        </Table>
      )
    } else {
      transactions_area = (
        <div>No transactions yet</div>
      )
    }
    const main_content = (
      <div>
        <div>
          <h1>
            Transactions
            <Link className="btn btn-primary pull-right" to="/dashboard/transactions/new">+ New Transaction</Link>
          </h1>
        </div>
        <div>
          { saved_message }
          { transactions_area }
        </div>
      </div>
    )
    return (
      <div style={ S('minw-1000') }>
        <header>
          <MainNav data={ data }/>
        </header>
        <main>
          <SideBar data={ data }/>
          <div style={ main_style }>
            { main_content }
          </div>
        </main>
      </div>
    )
  }
}

// PropTypes
Transactions.propTypes = {
  data: React.PropTypes.object
}