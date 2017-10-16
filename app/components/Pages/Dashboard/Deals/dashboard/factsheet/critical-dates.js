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
  const closingDate = Deal.get.field(deal, 'closing_date')
  const expirationDate = Deal.get.field(deal, 'expiration_date')

  if (isValid(closingDate)) {
    return {
      name: 'closing_date',
      value: parseDate(closingDate)
    }
  } else if (isValid(expirationDate)) {
    return {
      name: 'expiration_date',
      value: parseDate(expirationDate)
    }
  } else {
    return null
  }
}

const table = {
  list_date: ['Listing Date', 'Lst.'],
  expiration_date: ['Listing Expiration', 'Exp.'],
  contract_date: ['Contract Date', 'Con.'],
  option_period: ['Option Period', 'Opt.'],
  financing_due: ['Financing Due', 'Fin.'],
  title_due: ['Title Work Due', 'Til.'],
  t47_due: ['Survey Due', 'T47.'],
  closing_date: ['Closing', 'Cls.'],
  possession_date: ['Possession', 'Pos.']
}

const CriticalDates = ({
  deal,
  showTitle = true
}) => {
  const nextDate = getNextDateField(deal)

  return (
    <div className="deal-info-section">
      {
        showTitle &&
        <div className="deal-info-title">
          Critical Dates
        </div>
      }

      <table className="fact-table critical-dates">
        <tbody>
          {
            _.map(table, (name, field) => {
              const date = getDate(deal, field)
              return (
                <tr key={`CRITICAL_FIELD_${field}`}>
                  <td className="name">
                    <i
                      className={cn('fa fa-circle', 'status', date.status, {
                        next: nextDate && nextDate.name === field
                      })}
                    />
                    { name[0] }
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
    </div>
  )
}

CriticalDates.getNextDate = function(deal) {
  const date = getNextDateField(deal)

  if (!date) {
    return 'No closing date'
  }

  return table[date.name][1] + ' ' + moment(new Date(date.value)).format('MMM DD, YYYY')
}

export default CriticalDates
