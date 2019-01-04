import React from 'react'
import Deal from '../../../../../../../models/Deal'
import Context from '../../../../../../../models/Deal/helpers/dynamic-context'
import Render from '../renderer'

/**
 * get field of upcoming (next) date
 */
const getNextDateField = deal => {
  const closingDate = Deal.get.field(deal, 'closing_date')
  const expirationDate = Deal.get.field(deal, 'expiration_date')

  if (closingDate) {
    return {
      name: 'closing_date',
      value: Context.parseDate(closingDate)
    }
  } else if (expirationDate) {
    return {
      name: 'expiration_date',
      value: Context.parseDate(expirationDate)
    }
  }

  return null
}

const CriticalDates = ({ deal, showTitle = true }) => {
  const table = Context.getFactsheetSection(deal, 'CriticalDates')

  if (table.length === 0) {
    return false
  }

  return (
    <div className="deal-info-section">
      <Render
        sectionId="critical-dates"
        title="CRITICAL DATES"
        showTitle={showTitle}
        table={table}
        deal={deal}
      />
    </div>
  )
}

/**
 * get next date
 */
CriticalDates.getNextDate = function getNextDate(deal) {
  const date = getNextDateField(deal)

  if (!date) {
    return 'No closing date'
  }

  const field = Context.getFactsheetSection(deal, 'CriticalDates').find(
    item => item.name === date.name
  )

  return field && `${field.short_label}. ${date.value.format('MMM DD, YYYY')}`
}

/**
 * get next date value
 */
CriticalDates.getNextDateValue = function getNextDate(deal) {
  const date = getNextDateField(deal)

  if (!date) {
    return ''
  }

  return date.value.format('x')
}

export default CriticalDates
