import React from 'react'
import moment from 'moment'
import cn from 'classnames'
import Deal from '../../../../../../../models/Deal'
import Items from '../items'

const table = [
  {
    key: 'list_date',
    name: 'Listing Date',
    alias: 'Lst.',
    fieldType: 'date',
    canEdit: (isBO) => isBO
  }, {
    key: 'expiration_date',
    name: 'Listing Expiration',
    alias: 'Exp.',
    fieldType: 'date',
    canEdit: (isBO) => isBO
  }, {
    key: 'contract_date',
    name: 'Offer Date',
    alias: 'Off.',
    fieldType: 'date',
    canEdit: (isBO) => isBO
  }, {
    key: 'option_period',
    name: 'Option Ending',
    alias: 'Opt.',
    fieldType: 'date',
    canEdit: (isBO) => isBO
  }, {
    key: 'financing_due',
    name: 'Financing Due',
    alias: 'Fin.',
    fieldType: 'date',
    canEdit: () => true
  }, {
    key: 'title_due',
    name: 'Title Work Due',
    alias: 'Til.',
    fieldType: 'date',
    canEdit: () => true
  }, {
    key: 't47_due',
    name: 'Survey Due',
    alias: 'T47.',
    fieldType: 'date',
    canEdit: () => true
  }, {
    key: 'closing_date',
    name: 'Closing',
    alias: 'Cls.',
    fieldType: 'date',
    canEdit: (isBO) => isBO
  }, {
    key: 'possession_date',
    name: 'Possession',
    alias: 'Pos.',
    fieldType: 'date',
    canEdit: (isBO) => isBO
  }
]

/**
 * parse date to unix time
 */
const parseDate = (date) => {
  return moment.unix(date).utc()
}

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
  } else {
    return null
  }
}

const getLabel = (deal, field, ctx) => {
  const nextDate = getNextDateField(deal)

  return (
    <div>
      <i
        className={cn('fa fa-circle', 'status', ctx.status, {
          next: nextDate && nextDate.name === field.key
        })}
      />

      { field.name }
    </div>
  )
}

const getValue = (deal, field) => {
  return getDate(deal, field.key)
}

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
      getLabel={getLabel}
    />
  </div>
)

/**
 * get next date
 */
CriticalDates.getNextDate = function(deal) {
  const date = getNextDateField(deal)

  if (!date) {
    return 'No closing date'
  }

  const field = table.find(item => item.key === date.name)
  return field.alias + ' ' + date.value.format('MMM DD, YYYY')
}

export default CriticalDates
