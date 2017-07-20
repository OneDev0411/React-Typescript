import React from 'react'
import _ from 'underscore'

const table = {
  a1: 'Property Type',
  a2: 'MLS',
  a3: 'File ID',
}

export default ({
  deal
}) => (
  <div className="listing-info">
    <ul>
      {
        _.map(table, (name, field) => (
          <li key={`LISTING_INFO_FIELD_${field}`}>
            { name }:&nbsp;
            <span className="field"> --- </span>
          </li>
        ))
      }
    </ul>
  </div>
)
