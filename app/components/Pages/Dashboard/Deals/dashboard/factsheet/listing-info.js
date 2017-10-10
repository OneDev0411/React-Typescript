import React from 'react'
import _ from 'underscore'
import Deal from '../../../../../../models/Deal'

const table = {
  list_price: ['List Price', 'price'],
  property_type: ['Property Type', 'text'],
  mls_number: ['MLS', 'text'],
  file_id: ['File ID', 'text']
}

function print(deal, field, info) {
  const type = info[1]
  const value = Deal.get.field(deal, field)

  if (type === 'price') {
    return Deal.get.formattedPrice(value)
  }

  return value
}

export default ({
  deal
}) => (
  <div className="deal-info-section">
    <div className="deal-info-title">
      Listing Information
    </div>

    <table className="fact-table listing-info">
      <tbody>
        {
          _.map(table, (info, field) => (
            <tr key={`LISTING_INFO_FIELD_${field}`}>
              <td className="name no-status">{info[0]}</td>
              <td className="field">
                {print(deal, field, info)}
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
)
