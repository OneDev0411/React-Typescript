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
  <div className="listing-info">
    <ul>
      {
        _.map(table, (name, field) => (
          <li key={`LISTING_INFO_FIELD_${field}`}>
            <span className="name no-status">{ name }:</span>
            <span className="field">
              {Deal.get.field(deal, field)}
            </span>
          </li>
        ))
      }
    </ul>
  </div>
)
