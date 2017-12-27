import React from 'react'
import moment from 'moment'
import Deal from '../../../../../../../models/Deal'
import Items from '../items'

const table = [
  {
    key: 'list_date',
    name: 'Listing Date',
    alias: 'Lst.',
    fieldType: 'date',
    canEdit: (isBO) => isBO,
    validate: () => true
  }, {
    key: 'expiration_date',
    name: 'Listing Expiration',
    alias: 'Exp.',
    fieldType: 'date',
    canEdit: (isBO) => isBO,
    validate: () => true
  }, {
    key: 'contract_date',
    name: 'Offer Date',
    alias: 'Off.',
    fieldType: 'date',
    canEdit: (isBO) => isBO,
    validate: () => true
  }, {
    key: 'option_period',
    name: 'Option Ending',
    alias: 'Opt.',
    fieldType: 'date',
    canEdit: (isBO) => isBO,
    validate: () => true
  }, {
    key: 'financing_due',
    name: 'Financing Due',
    alias: 'Fin.',
    fieldType: 'date',
    canEdit: () => true,
    validate: () => true
  }, {
    key: 'title_due',
    name: 'Title Work Due',
    alias: 'Til.',
    fieldType: 'date',
    canEdit: () => true,
    validate: () => true
  }, {
    key: 't47_due',
    name: 'Survey Due',
    alias: 'T47.',
    fieldType: 'date',
    canEdit: () => true,
    validate: () => true
  }, {
    key: 'closing_date',
    name: 'Closing',
    alias: 'Cls.',
    fieldType: 'date',
    canEdit: (isBO) => isBO,
    validate: () => true
  }, {
    key: 'possession_date',
    name: 'Possession',
    alias: 'Pos.',
    fieldType: 'date',
    canEdit: (isBO) => isBO,
    validate: () => true
  }
]

/**
 * parse date to unix time
 */
const parseDate = (date) => moment.unix(date).utc()

/**
 * get date
 */
const getDate = (deal, field) => {
  const now = moment()
  const date = Deal.get.field(deal, field)

  let status = 'unknown'

  if (!date) {
    return {
      value: '',
      approved: false,
      status
    }
  }

  const dateObject = parseDate(date)

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

  if (closingDate) {
    return {
      name: 'closing_date',
      value: parseDate(closingDate)
    }
  } else if (expirationDate) {
    return {
      name: 'expiration_date',
      value: parseDate(expirationDate)
    }
  }

  return null
}

const getValue = (deal, field) => getDate(deal, field.key)

const CriticalDates = ({
  deal,
  showTitle = true
}) => (
  <div className="deal-info-section">
    <Items
      title="CRITICAL DATES"
      showTitle={showTitle}
      table={table}
      deal={deal}
      getValue={getValue}
    />
  </div>
)

/**
 * get next date
 */
CriticalDates.getNextDate = function (deal) {
  const date = getNextDateField(deal)

  if (!date) {
    return 'No closing date'
  }

  const field = table.find(item => item.key === date.name)

  return `${field.alias} ${date.value.format('MMM DD, YYYY')}`
}

export default CriticalDates
