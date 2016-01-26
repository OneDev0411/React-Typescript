// ./Partials/Transaction.js
import React, { Component } from 'react'
import S from 'shorti'
import helpers from '../../../../../utils/helpers'
import listing_util from '../../../../../utils/listing'

export default class Transaction extends Component {
  render() {
    const transaction = this.props.transaction
    const listing_data = transaction.listing_data
    const status_color = listing_util.getStatusColor(listing_data.status)
    let transaction_image = (
      <div style={ S(`w-92 h-62 bg-929292`) }></div>
    )
    if (transaction.listing) {
      transaction_image = (
        <div style={ S(`w-92 h-62 bg-cover bg-center bg-url(${transaction.listing.cover_image_url})`) }></div>
      )
    }
    return (
      <div>
        <div style={ S('absolute r-10 mt-10 mr-10 color-a1bde4') }>
          ${ helpers.numberWithCommas(transaction.contract_price) }
        </div>
        <div style={ S('pull-left mr-10') }>
          { transaction_image }
        </div>
        <div style={ S('pull-left') }>
          <div style={ S('mt-10 fw-500') }>
            { transaction.title }
          </div>
          <div style={ S('mt-10 relative') }>
            <span style={ S('mr-5 font-26 l-0 t-16n absolute color-' + status_color) }>&#8226;</span>
            <span style={ S('font-12 color-929292 ml-16 relative t-7n') }>{ transaction.listing_data.status }</span>
          </div>
        </div>
        <div className="clearfix"></div>
      </div>
    )
  }
}

// PropTypes
Transaction.propTypes = {
  transaction: React.PropTypes.object
}