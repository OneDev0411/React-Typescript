// Modules/Tasks/Partials/Transaction.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import S from 'shorti'
import helpers from '../../../../../../utils/helpers'
import listing_util from '../../../../../../utils/listing'

export default class Transaction extends Component {
  render() {
    const transaction = this.props.transaction
    const listing_data = transaction.listing_data
    let listing_title = 'No address'
    let listing_status_area
    if (listing_data) {
      listing_title = transaction.listing_data.property.address.street_full
      const status_color = listing_util.getStatusColor(listing_data.status)
      listing_status_area = (
        <div style={S('mt-10 relative')}>
          <span style={S(`mr-5 font-26 l-0 t-16n absolute color-${status_color}`)}>&#8226;</span>
          <span style={S('font-12 color-929292 ml-16 relative t-7n')}>{ transaction.listing_data.status }</span>
        </div>
      )
    }
    let transaction_image = (
      <div style={S('w-92 h-62 bg-EFF1F2')} />
    )
    if (transaction.listing) {
      transaction_image = (
        <div style={S(`w-92 h-62 bg-cover bg-center bg-url(${transaction.listing.cover_image_url})`)} />
      )
    }
    let contract_price
    if (transaction.contract_price)
      contract_price = `$${helpers.numberWithCommas(transaction.contract_price)}`

    let transaction_area
    const transaction_markup = (
      <div>
        <div style={S('absolute r-10 mt-10 mr-10 color-a1bde4')}>
          { contract_price }
        </div>
        <div style={S('pull-left mr-10')}>
          { transaction_image }
        </div>
        <div style={S('pull-left')}>
          <div style={S('mt-10 fw-500')}>
            { listing_title }
          </div>
          { listing_status_area }
        </div>
        <div className="clearfix" />
      </div>
    )
    if (!this.props.is_linked)
      transaction_area = transaction_markup
    else {
      transaction_area = (
        <Link to={`/dashboard/transactions/${transaction.id}`}>
          { transaction_markup }
        </Link>
      )
    }
    return transaction_area
  }
}

// PropTypes
Transaction.propTypes = {
  transaction: React.PropTypes.object,
  is_linked: React.PropTypes.bool
}