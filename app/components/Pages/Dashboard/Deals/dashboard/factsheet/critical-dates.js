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

const CriticalDates = ({
  deal
}) => (
  <div className="critical-dates">
    <ul>
      {
        _.map(table, (name, field) => {
          return (
            <li key={`CRITICAL_FIELD_${field}`}>
              <span className="status"></span>
              <span className="name">{ name }: </span>
              <span className="field">-</span>
            </li>
          )
        })
      }
    </ul>
  </div>
)

CriticalDates.getNextDate = function(deal) {
  return moment().format('MMMM DD, YYYY')
}

export default CriticalDates
