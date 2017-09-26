import React from 'react'
import _ from 'underscore'
import Deal from '../../../../../../models/Deal'

const formatPrice = (number) => {
  if (!number) {
    return number
  }

  return '$' + number
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const table = {
  list_price: 'List Price',
  sale_price: 'Sale Price',
  commission_listing: 'Listing Commission',
  commission_selling: 'Sale Commission'
}

export default ({
  deal
}) => (
  <div className="deal-info-section">
    <div className="deal-info-title">
      CDA Information
    </div>
    <table className="fact-table comission">
      <tbody>
        {
          _.map(table, (name, field) => (
            <tr key={`COMMISSION_FIELD_${field}`}>
              <td className="name no-status">{ name }</td>
              <td className="field">
                {formatPrice(Deal.get.field(deal, field))}
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
)
