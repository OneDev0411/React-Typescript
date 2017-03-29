// Dashboard/Transactions/index.js
import React, { Component } from 'react'
import { Table } from 'react-bootstrap'
import S from 'shorti'
import _ from 'lodash'

// AppStore
import AppStore from '../../../../stores/AppStore'

// TransactionDispatcher
import TransactionDispatcher from '../../../../dispatcher/TransactionDispatcher'

// Partials
import SideBar from '../Partials/SideBar'
import Header from '../Partials/Header'
import Loading from '../../../Partials/Loading'

// Helpers
import helpers from '../../../../utils/helpers'
import listing_util from '../../../../utils/listing'

export default class Transactions extends Component {

  componentDidMount() {
    const data = this.props.data
    if (!data.transactions)
      this.getTransactions()
    delete AppStore.data.current_transaction
    AppStore.emitChange()
  }

  getTransactions() {
    const data = this.props.data
    AppStore.data.getting_transactions = true
    AppStore.emitChange()
    TransactionDispatcher.dispatch({
      action: 'get-all',
      user: data.user
    })
  }

  handleClickTransaction(transaction) {
    const transaction_tabs = AppStore.data.transaction_tabs
    if (!_.find(transaction_tabs, { id: transaction.id }))
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
    // Remove current task
    delete AppStore.data.current_task
    AppStore.emitChange()
    const attachments = transaction.attachments
    const attachments_sorted = _.sortBy(attachments, 'created', attachment => -attachment.created)
    transaction.attachments = attachments_sorted
    AppStore.data.current_transaction = transaction
    const history = require('../../../../utils/history')
    history.replaceState(null, `/dashboard/transactions/${transaction.id}`)
    AppStore.emitChange()
  }

  removeTransactionTab(id) {
    // TODO Stay on current tab or go to all transaction tab (after other tab click event triggered)
    setTimeout(() => {
      const transaction_tabs = AppStore.data.transaction_tabs
      const current_transaction = AppStore.data.current_transaction
      const reduced_transaction_tabs = transaction_tabs.filter(transaction => transaction.id !== id)
      AppStore.data.transaction_tabs = reduced_transaction_tabs
      if (current_transaction.id === id)
        delete AppStore.data.current_transaction
      const history = require('../../../../utils/history')
      history.replaceState(null, '/dashboard/transactions')
      AppStore.emitChange()
    }, 1)
  }

  hasNotification(transaction_id) {
    const data = this.props.data
    if (!data.notifications)
      return false
    const summary = data.notifications.summary
    return summary.transaction_ids.indexOf(transaction_id) > -1
  }

  render() {
    // Data
    const data = this.props.data
    const transactions = data.transactions

    // Transactions
    let transactions_rows
    if (transactions) {
      transactions_rows = transactions.map((transaction) => {
        let listing
        let address
        // Price
        let contract_price = transaction.contract_price
        if (contract_price)
          contract_price = `$${helpers.numberWithCommas(contract_price)}`
        // Dates
        const important_dates = transaction.important_dates
        let closing_date
        if (important_dates)
          closing_date = _.result(_.find(important_dates, { title: 'closing' }), 'due_date')
        if (transaction.listing) {
          listing = transaction.listing
          address = `${listing.property.address.street_number} ${listing.property.address.street_name}`
        }
        let cover_image = <div style={S('w-90 h-62 bg-eff1f2 color-929292 text-center pt-20')}>No image</div>
        if (listing && listing.cover_image_url) {
          cover_image = (
            <div style={S(`w-90 h-62 bg-center bg-cover bg-url(${listing.cover_image_url})`)} />
          )
        }
        let listing_status
        if (listing)
          listing_status = listing.status
        const status_color = listing_util.getStatusColor(listing_status)
        // Get client
        const clients = _.forEach(transaction.contacts, (contact) => {
          const roles = contact.roles
          if (roles && roles.indexOf('Client') !== -1)
            return contact
        })
        let listing_status_indicator
        if (listing) {
          listing_status_indicator = (
            <div style={S('color-929394 relative t-10n')}>
              <span style={S(`font-26 relative t-3 color-${status_color}`)}>&#8226;</span> { listing.status }
            </div>
          )
        }
        let friendly_date
        if (closing_date)
          friendly_date = helpers.friendlyDate(closing_date)
        let client_name
        if (clients && clients[0])
          client_name = `${clients[0].first_name} ${clients[0].last_name}`

        let notification_icon
        if (this.hasNotification(transaction.id)) {
          notification_icon = (
            <i className="fa fa-circle" style={S('font-8 color-3388FF pt-30')} />
          )
        }

        return (
          <tr onClick={this.handleClickTransaction.bind(this, transaction)} style={S('pointer')} key={transaction.id}>
            <td>
              { notification_icon }
            </td>
            <td>
              <div className="pull-left" style={S('mt-5 ml-5')}>{ cover_image }</div>
              <div className="pull-left" style={S('ml-20 mt-15 maxw-200')}>
                { address }
                { listing_status_indicator }
              </div>
            </td>
            <td>
              <div style={S('mt-20')}>
                { client_name }
                <div style={S('color-929394')}>{ transaction.transaction_type }</div>
              </div>
            </td>
            <td>
              <div style={S('mt-20')}>
                { contract_price }
              </div>
            </td>
            <td>
              <div style={S('mt-20')}>
                Tax Document
              </div>
            </td>
            <td>
              <div style={S('mt-20')}>
                { friendly_date ? `${friendly_date.month} ${friendly_date.date}, ${friendly_date.year}` : 'TBD' }
              </div>
            </td>
          </tr>
        )
      }) // end trans loop
    } // end if (transactions)

    let main_content = (
      <div style={S('pl-15 pr-15')}>
        <Loading />
      </div>
      )
    if (transactions_rows) {
      if (transactions_rows.length) {
        main_content = (
          <div style={S('pl-15 pr-15')}>
            <Table style={S('mt-10n minw-760')} className="table--tabbable" condensed hover>
              <thead>
                <tr>
                  <th width="5" />
                  <th width="150">Property</th>
                  <th width="100">Contact</th>
                  <th width="100">Price</th>
                  <th width="100">Next Task</th>
                  <th width="100">Closing Date</th>
                </tr>
              </thead>
              <tbody>
                { transactions_rows }
              </tbody>
            </Table>
          </div>
        )
      } else {
        main_content = (
          <div style={S('pl-15 pr-15')}>No transactions yet.  Maybe this needs to say something snarky or clever.</div>
        )
      }
    }

    // Style
    const main_style = S('absolute l-70 r-0')

    return (
      <div style={S('minw-1000')}>
        <Header
          data={data}
          viewTransaction={this.viewTransaction.bind(this)}
          removeTransactionTab={this.removeTransactionTab}
        />
        <main style={S('pt-15')}>
          <SideBar
            data={data}
          />
          <div style={main_style}>
            { main_content }
          </div>
        </main>
      </div>
    )
  }
}

// PropTypes
Transactions.propTypes = {
  data: React.PropTypes.object,
  route: React.PropTypes.object,
  params: React.PropTypes.object
}