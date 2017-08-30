import React from 'react'
import moment from 'moment'
import cn from 'classnames'
import _ from 'underscore'
import Deal from '../../../../../../models/Deal'

const getDate = (deal, field) => {
  const now = moment()
  const date = Deal.get.field(deal, field)
  let status = 'unknown'

  if (!date) {
    return {
      value: '',
      status
    }
  }

  const dateObject = moment(date)

  if (dateObject.isAfter(now)) {
    status = 'future'
  } else {
    status = 'past'
  }

  return {
    value: dateObject.format('MMM DD, YYYY'),
    status
  }
}

/**
 * get field of upcoming (next) date
 */
const getNextDateField = (deal) => {
  const now = moment().format('X')

  let dates = {}

  _.each(table, (name, field) => {
    const date = Deal.get.field(deal, field)
    const value = date ? ~~moment(date).format('X') : 0

    if (value >= now) {
      dates[field] = {
        name: field,
        value: value
      }
    }
  })

  dates = _.sortBy(dates, date => date.value)

  if (dates.length > 0) {
    return dates[0].name
  }

  return null
}

const table = {
  list_date: 'Listing Date',
  expiration_date: 'Listing Expiration',
  contract_date: 'Contract Date',
  contract_expiration: 'Contract Expiration',
  option_period: 'Option Period',
  financing_due: 'Financing Due',
  title_due: 'Title Work Due',
  t47_due: 'Survey / T47 Due',
  closing_date: 'Closing',
  possession_date: 'Possession'
}

const CriticalDates = ({
  deal
}) => {
  const nextDate = getNextDateField(deal)

  return (
    <div className="critical-dates">
      <ul>
        {
          _.map(table, (name, field) => {
            const date = getDate(deal, field)
            return (
              <li key={`CRITICAL_FIELD_${field}`}>
                <span
                  className={cn('status', date.status,{
                    next: nextDate && nextDate.name === field
                  })}
                >
                  {
                    date.status === 'past' &&
                    <span className="check">✓</span>
                  }
                </span>
                <span className="name">{ name }: </span>
                <span className="field">
                  { date.value }
                </span>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

CriticalDates.getNextDate = function(deal) {
  const date = getNextDateField(deal)
  if (!date) {
    return '-'
  }

  return moment.unix(date.value).format('MMM DD, YYYY')
}

export default CriticalDates
