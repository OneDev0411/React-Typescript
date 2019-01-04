import Deal from 'models/Deal'
import Context from 'models/Deal/helpers/dynamic-context'

export function getNextDateField(deal) {
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

export function getNextDate(deal) {
  const date = getNextDateField(deal)

  if (!date) {
    return false
  }

  const field = Context.getFactsheetSection(deal, 'CriticalDates').find(
    item => item.name === date.name
  )

  return field && `${field.short_label}. ${date.value.format('MMM DD, YYYY')}`
}

export function getNextDateValue(deal) {
  const date = getNextDateField(deal)

  if (!date) {
    return ''
  }

  return date.value.format('x')
}
