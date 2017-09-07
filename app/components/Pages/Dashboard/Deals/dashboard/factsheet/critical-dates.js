import React from 'react'
import moment from 'moment'
import cn from 'classnames'
import _ from 'underscore'
import Deal from '../../../../../../models/Deal'

const isValid = (date) => {
  if (!date) {
    return false
  }

  return isNaN(parseDate(date)) === false
}

const parseDate = (date) => {
  return Date.parse(date)
}

const getDate = (deal, field) => {
  const now = moment()
  const date = Deal.get.field(deal, field)
  let status = 'unknown'

  if (isValid(date) === false) {
    return {
      value: '',
      status
    }
  }

  const dateObject = moment(new Date(parseDate(date)))

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
    const value = isValid(date) ? parseDate(date) : 0

    if (value >= now) {
      dates[field] = {
        name: field,
        value: value
      }
    }
  })

  dates = _.sortBy(dates, date => date.value)

  if (dates.length > 0) {
    return dates[0]
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
    <table className="fact-table critical-dates">
      <tbody>
        {
          _.map(table, (name, field) => {
            const date = getDate(deal, field)
            return (
              <tr key={`CRITICAL_FIELD_${field}`}>
                <td className="name">
                  <i
                    className={cn('fa', 'status', date.status, {
                      next: nextDate && nextDate.name === field,
                      'fa-check-circle': date.status === 'past',
                      'fa-circle': date.status !== 'past'
                    })}
                  />
                  { name }
                </td>
                <td className="field">
                  { date.value }
                </td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}

CriticalDates.getNextDate = function(deal) {
  const date = getNextDateField(deal)

  if (!date) {
    return '-'
  }

  return moment(new Date(date.value)).format('MMM DD, YYYY')
}

export default CriticalDates
