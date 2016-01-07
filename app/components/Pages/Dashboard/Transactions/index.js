// Dashboard/Transactions/index.js
import React, { Component } from 'react'
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
import SideBar from '../Partials/SideBar'
import Header from '../Partials/Header'

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

  handleCloseSavedAlert() {
    delete AppStore.data.new_transaction.saved
    AppStore.emitChange()
  }

  handleClickTransaction(transaction) {
    const transaction_tabs = AppStore.data.transaction_tabs
    if (!_.findWhere(transaction_tabs, { id: transaction.id }))
      this.addTransactionTab(transaction)
    this.viewTransaction(transaction)
  }

  addTransactionTab(transaction) {
    const transaction_tabs = AppStore.data.transaction_tabs
    if (!transaction_tabs)
      AppStore.data.transaction_tabs = []
    AppStore.data.transaction_tabs.push(transaction)
    AppStore.emitChange()
  }

  viewTransaction(transaction) {
    if (transaction === 'all')
      delete AppStore.data.current_transaction
    else
      AppStore.data.current_transaction = transaction
    AppStore.emitChange()
  }

  removeTransactionTab(id) {
    // Go to all transaction tab (after other tab click event triggered)
    setTimeout(() => {
      const transaction_tabs = AppStore.data.transaction_tabs
      const current_transaction = AppStore.data.current_transaction
      const reduced_transaction_tabs = transaction_tabs.filter(transaction => {
        return transaction.id !== id
      })
      AppStore.data.transaction_tabs = reduced_transaction_tabs
      if (current_transaction.id === id)
        delete AppStore.data.current_transaction
      AppStore.emitChange()
    }, 10)
  }

  render() {
    // Data
    const data = this.props.data
    const transactions = data.transactions

    // Style
    const main_style = S('absolute l-222 r-0 pl-20 pr-20')

    // Transactions
    let transactions_rows
    if (transactions) {
      transactions_rows = transactions.map((transaction) => {
        let listing
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
          if (closing_date) {
            closing_date = closing_date.toString()
            closing_date = closing_date.replace('T00:00:00.000Z', '')
          }
        }
        if (transaction.listing) {
          listing = transaction.listing
          address = `${listing.property.address.street_number} ${listing.property.address.street_name}`
        }
        let cover_image = <div style={ S('w-90 h-62 bg-333 color-fff text-center pt-20') }>No Image</div>
        if (listing && listing.cover_image_url) {
          cover_image = (
            <div style={ S('w-90 h-62 bg-center bg-cover bg-url(' + listing.cover_image_url + ')') }></div>
          )
        }
        let contacts_num
        if (transaction.contacts)
          contacts_num = transaction.contacts.length

        let status_color = 'c3c3c3'
        if (listing) {
          if (listing.status === 'Active')
            status_color = '35b863'
          if (listing.status === 'Active Contingent')
            status_color = 'f8b619'
          if (listing.status === 'Expired' || listing.status === 'Sold')
            status_color = 'db3821'
        }

        // Get client
        const clients = _.forEach(transaction.contacts, contact => {
          const roles = contact.roles
          if (roles.indexOf('Client') !== -1)
            return contact
        })
        let listing_status
        if (listing) {
          listing_status = (
            <div style={ S('color-929394 relative t-10n') }>
              <span style={ S('font-26 relative t-3 color-' + status_color) }>&#8226;</span> { listing.status }
            </div>
          )
        }
        return (
          <tr onClick={ this.handleClickTransaction.bind(this, transaction) } style={ S('pointer') } key={ transaction.id }>
            <td>
              <div className="pull-left" style={ S('mt-5 ml-5') }>{ cover_image }</div>
              <div className="pull-left" style={ S('ml-20 mt-15 maxw-200') }>
                { address }
                { listing_status }
              </div>
            </td>
            <td>
              <div style={ S('mt-20') }>
                { `${clients[0].first_name} ${clients[0].last_name}` }
                <div style={ S('color-929394') }>Client</div>
              </div>
            </td>
            <td>
              <div style={ S('mt-20') }>
                { contract_price }
              </div>
            </td>
            <td>
              <div style={ S('mt-20') }>
                { contacts_num }
              </div>
            </td>
            <td>
              <div style={ S('mt-20') }>
                Tax Document
              </div>
            </td>
            <td>
              <div style={ S('mt-20') }>
                { closing_date ? closing_date : 'TBD' }
              </div>
            </td>
          </tr>
        )
      })
    }
    let saved_message
    if (data.new_transaction && data.new_transaction.saved) {
      saved_message = (
        <Alert bsStyle="success">Transaction saved!<button className="close" type="button" onClick={ this.handleCloseSavedAlert.bind(this) }>&times;</button></Alert>
      )
    }

    let transactions_area
    if (transactions_rows && transactions_rows.length) {
      transactions_area = (
        <Table style={ S('mt-10n') } className="transactions__table" condensed hover>
          <thead>
            <tr>
              <th>Property</th>
              <th>Contact</th>
              <th>Price</th>
              <th>Contacts</th>
              <th>Next Task</th>
              <th>Closing Date</th>
            </tr>
          </thead>
          <tbody>
            { transactions_rows }
          </tbody>
        </Table>
      )
    } else {
      transactions_area = (
        <div>No transactions yet.</div>
      )
    }

    // Single view
    const current_transaction = data.current_transaction
    if (current_transaction) {
      transactions_area = (
        <div>
          <Button style={ S('absolute r-20') } className={ data.deleting_transaction && data.deleting_transaction === current_transaction.id ? 'disabled' : '' } onClick={ this.deleteTransaction.bind(this, current_transaction.id) } type="button" bsStyle="danger">
            { data.deleting_transaction && data.deleting_transaction === current_transaction.id ? 'Deleting...' : 'Delete' }
          </Button>
          <h4>Transaction detail view</h4>
        </div>
      )
    }

    const main_content = (
      <div>
        <div>
          { saved_message }
          { transactions_area }
        </div>
      </div>
    )

    return (
      <div style={ S('minw-1000') }>
        <Header data={ data } viewTransaction={ this.viewTransaction.bind(this) } removeTransactionTab={ this.removeTransactionTab.bind(this) } />
        <main style={ S('pt-15') }>
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