import React from 'react'
import _ from 'underscore'

const table = {
  a1: 'Listing Comm',
  a2: 'Sale Comm',
  a3: 'Source',
}

export default ({
  deal
}) => (
  <div className="comission">

    <ul>
      {
        _.map(table, (name, field) => (
          <li key={`COMMISSION_FIELD_${field}`}>
            <span className="name no-status">{ name }:</span>
            <span className="field">-</span>
          </li>
        ))
      }
    </ul>
  </div>
)
