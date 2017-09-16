import React from 'react'
import _ from 'underscore'
import Deal from '../../../../../../models/Deal'

const table = {
  property_type: 'Property Type',
  mls_number: 'MLS',
  file_id: 'File ID',
}

export default ({
  deal
}) => (
  <div className="deal-info">
    <div className="deal-info-title">
      Listing Information
    </div>

    <table className="fact-table listing-info">
      <tbody>
        {
          _.map(table, (name, field) => (
            <tr key={`LISTING_INFO_FIELD_${field}`}>
              <td className="name no-status">{ name }:</td>
              <td className="field">
                {Deal.get.field(deal, field)}
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
)
