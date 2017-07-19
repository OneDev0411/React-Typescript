import React from 'react'
import moment from 'moment'
import _ from 'underscore'

const table = {
  a1: 'Executed Date',
  a2: 'Listing Date',
  a3: 'Option Expiration',
  a4: 'Buyer Financing',
  a5: 'Title Work Due',
  a6: 'Survey Due',
  a7: 'T47 Due',
  a8: 'Listing Expiration',
  a9: 'Closing',
  a10: 'Possession',
}

export default ({
  deal
}) => (
  <div className="critical-dates">
    <ul>
      {
        _.map(table, (name, field) => {
          const time = moment().format('MMMM DD, YYYY')
          return (
            <li key={`CRITICAL_FIELD_${field}`}>
              <span className="status"></span>
              { name }:&nbsp;
              <span className="field">{ time }</span>
            </li>
          )
        })
      }
    </ul>
  </div>
)
