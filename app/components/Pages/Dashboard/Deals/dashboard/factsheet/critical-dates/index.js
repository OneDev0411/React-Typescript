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
    side: 'office',
    canEdit: (isBO) => isBO
  }, {
    key: 'expiration_date',
    name: 'Listing Expiration',
    alias: 'Exp.',
    fieldType: 'date',
    side: 'office',
    canEdit: (isBO) => isBO
  }, {
    key: 'contract_date',
    name: 'Contract Date',
    alias: 'Con.',
    fieldType: 'date',
    side: 'office',
    canEdit: (isBO) => isBO
  }, {
    key: 'option_period',
    name: 'Option Period',
    alias: 'Opt.',
    fieldType: 'date',
    side: 'office',
    canEdit: (isBO) => isBO
  }, {
    key: 'financing_due',
    name: 'Financing Due',
    alias: 'Fin.',
    fieldType: 'date',
    side: 'agent',
    canEdit: () => true
  }, {
    key: 'title_due',
    name: 'Title Work Due',
    alias: 'Til.',
    fieldType: 'date',
    side: 'agent',
    canEdit: () => true
  }, {
    key: 't47_due',
    name: 'Survey Due',
    alias: 'T47.',
    fieldType: 'date',
    side: 'agent',
    canEdit: () => true
  }, {
    key: 'closing_date',
    name: 'Closing',
    alias: 'Cls.',
    fieldType: 'date',
    side: 'office',
    canEdit: (isBO) => isBO
  }, {
    key: 'possession_date',
    name: 'Possession',
    alias: 'Pos.',
    fieldType: 'date',
    side: 'office',
    canEdit: (isBO) => isBO
  }
]

/**
 * parse date to unix time
 */
const parseDate = (date) => {
  return moment.unix(date)
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
}) => {

  const props = { showTitle, table, deal, getValue, getLabel }

  return (
    <div className="deal-info-section">
      <Items
        title="Office Critical Dates"
        sideFilter="office"
        {...props}
      />

      <Items
        title="Agent Critical Dates"
        sideFilter="agent"
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

  const field = table.find(item => item.key === date.name)
  return field.alias + ' ' + date.value.format('MMM DD, YYYY')
}

export default CriticalDates
