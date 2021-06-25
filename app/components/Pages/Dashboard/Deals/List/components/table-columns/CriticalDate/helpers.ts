import moment from 'moment'

import { getField } from 'models/Deal/helpers/context'

export function getNextDateField(deal: IDeal) {
  const closingDate = getField(deal, 'closing_date')
  const expirationDate = getField(deal, 'expiration_date')

  if (closingDate) {
    return {
      key: 'closing_date',
      value: moment.unix(closingDate).utc()
    }
  }

  if (expirationDate) {
    return {
      key: 'expiration_date',
      value: moment.unix(expirationDate).utc()
    }
  }

  return null
}

export function getNextDate(deal: IDeal, contexts: IDealBrandContext[]) {
  const date = getNextDateField(deal)

  if (!date) {
    return false
  }

  const context = contexts.find(item => item.key === date.key)

  return (
    context && `${context.short_label}. ${date.value.format('MMM DD, YYYY')}`
  )
}

export function getNextDateValue(deal: IDeal) {
  const date = getNextDateField(deal)

  if (!date) {
    return 0
  }

  return date.value.format('x')
}
