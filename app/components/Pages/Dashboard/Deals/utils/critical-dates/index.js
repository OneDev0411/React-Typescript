import Deal from 'models/Deal'
import Context from 'models/Deal/helpers/dynamic-context'

export function getNextDateField(deal) {
  const closingDate = Deal.get.field(deal, 'closing_date')
  const expirationDate = Deal.get.field(deal, 'expiration_date')

  if (closingDate) {
    return {
      key: 'closing_date',
      value: Context.parseDate(closingDate)
    }
  }

  if (expirationDate) {
    return {
      key: 'expiration_date',
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

  const field = Context.getFactsheetSection(deal, 'Dates').find(
    item => item.key === date.key
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
