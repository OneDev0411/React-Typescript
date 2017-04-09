// Header.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Nav, NavItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import S from 'shorti'
import _ from 'lodash'
import helpers from '../../../../utils/helpers'

export default class Header extends Component {

  render() {
    const data = this.props.data
    const user = data.user
    const transactions = data.transactions
    const path = data.path
    let title
    let subtitle
    let nav_tabs
    // Recents
    if (path === '/dashboard/recents') {
      title = (
        <h2 style={S('font-22 mt-20')}>Conversations</h2>
      )
    }
    // MLS
    if (path === '/dashboard/mls') {
      title = (
        <h2 style={S('font-22 mt-20')}>Search</h2>
      )
    }

    // Transactions
    if (path.indexOf('/dashboard/transactions') !== -1) {
      const has_s = !transactions || transactions.length !== 1 ? 's' : ''
      title = (
        <h2 style={S('font-22 mt-20')}>{ transactions ? transactions.length : '' } Transaction{ has_s }</h2>
      )
      let transaction_tabs = data.transaction_tabs
      const current_transaction = data.current_transaction
      let transaction_tabs_markup
      if (transaction_tabs) {
        // Always unique
        transaction_tabs = _.uniq(transaction_tabs, (transaction) => {
          if (transaction)
            return transaction.id
        })
        transaction_tabs_markup = transaction_tabs.map((transaction) => {
          let tab_title = 'No Address'
          const listing = transaction.listing
          if (listing)
            tab_title = `${listing.property.address.street_number} ${listing.property.address.street_name}`
          return (
            <NavItem onClick={this.props.viewTransaction.bind(this, transaction)} key={`transaction-tab-${transaction.id}`} eventKey={transaction.id}>
              { tab_title }
              <div onClick={this.props.removeTransactionTab.bind(this, transaction.id)} style={S('relative l-8 w-23 h-25 bg-ccc text-center t-4n pointer')} className="close">
                &times;
              </div>
            </NavItem>
          )
        })
      }
      let active_tab = 'all'
      if (current_transaction)
        active_tab = current_transaction.id
      nav_tabs = (
        <div>
          <Nav className="table--tabbable__tabs" style={S('b-1n absolute ml-15')} bsStyle="tabs" activeKey={active_tab}>
            <LinkContainer to="/dashboard/transactions">
              <NavItem className="all-transactions-tab">
                All transactions
              </NavItem>
            </LinkContainer>
            { transaction_tabs_markup }
          </Nav>
          <Link style={S('absolute r-15 t-15')} className="btn btn-primary" to="/dashboard/transactions/new">+ Add Transaction</Link>
        </div>
      )
    }

    // Style
    let nav_bar_style = { ...S('mb-0 p-0 pt-3 relative'), borderBottom: '1px solid #e7e4e3' }

    // Taller header for transactions
    if (path.indexOf('/dashboard/transactions') !== -1)
      nav_bar_style = { ...nav_bar_style, ...S('h-108') }
    else
      nav_bar_style = { ...nav_bar_style, ...S('h-70') }

    return (
      <header style={S('pl-70')}>
        <div style={nav_bar_style} fluid>
          <div>
            <div style={S('pl-15 w-100p')}>
              { title }
              { subtitle }
            </div>
          </div>
          { nav_tabs }
        </div>
      </header>
    )
  }
}

// PropTypes
Header.propTypes = {
  data: React.PropTypes.object,
  viewTransaction: React.PropTypes.func,
  removeTransactionTab: React.PropTypes.func,
  viewContact: React.PropTypes.func,
  removeContactTab: React.PropTypes.func
}
