import React from 'react'
import moment from 'moment'
import Deal from '../../../../../../../models/Deal'
import Table from './table'

const table = [
  {
    key: 'list_date',
    name: 'Listing Date',
    alias: 'Lst.',
    side: 'office',
    canEdit: (isBO) => isBO
  }, {
    key: 'expiration_date',
    name: 'Listing Expiration',
    alias: 'Exp.',
    side: 'office',
    canEdit: (isBO) => isBO
  }, {
    key: 'contract_date',
    name: 'Contract Date',
    alias: 'Con.',
    side: 'office',
    canEdit: (isBO) => isBO
  }, {
    key: 'option_period',
    name: 'Option Period',
    alias: 'Opt.',
    side: 'office',
    canEdit: (isBO) => isBO
  }, {
    key: 'financing_due',
    name: 'Financing Due',
    alias: 'Fin.',
    side: 'agent',
    canEdit: () => true
  }, {
    key: 'title_due',
    name: 'Title Work Due',
    alias: 'Til.',
    side: 'agent',
    canEdit: () => true
  }, {
    key: 't47_due',
    name: 'Survey Due',
    alias: 'T47.',
    side: 'agent',
    canEdit: () => true
  }, {
    key: 'closing_date',
    name: 'Closing',
    alias: 'Cls.',
    side: 'office',
    canEdit: (isBO) => isBO
  }, {
    key: 'possession_date',
    name: 'Possession',
    alias: 'Pos.',
    side: 'office',
    canEdit: (isBO) => isBO
  }
]

/**
 * check date is valid or not
 */
const isValid = (date) => {
  if (!date) {
    return false
  }

  return isNaN(parseDate(date)) === false
}

/**
 * parse date to unix time
 */
const parseDate = (date) => {
  return Date.parse(date)
}

/**
 * get date
 */
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


const CriticalDates = ({
  deal,
  showTitle = true
}) => {
  const nextDate = getNextDateField(deal)

  const props = { showTitle, nextDate, getDate, table, deal }
  return (
    <div className="deal-info-section">
      <Table
        title="Office Critical Dates"
        filter="office"
        {...props}
      />

      <Table
        title="Agent Critical Dates"
        filter="agent"
        {...props}
      />
    </div>
  )
}

/**
 * get next date
 */
CriticalDates.getNextDate = function(deal) {
  const date = getNextDateField(deal)

  if (!date) {
    return 'No closing date'
  }

  return table[date.name].alias + ' ' + moment(new Date(date.value)).format('MMM DD, YYYY')
}

export default CriticalDates
