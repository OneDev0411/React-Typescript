import moment from 'moment'

import { getField } from '../get-field'
import { getFormattedPrice } from '../get-formatted-price'

/**
 * returns value of context
 */
export function getContextValue(deal: IDeal, context: IDealBrandContext) {
  if (!context) {
    return null
  }

  if (context.data_type === 'Date') {
    return getDateValue(deal, context)
  }

  if (context.key === 'property_type') {
    return {
      value: deal.property_type
    }
  }

  const contextValue = getField(deal, context.key)

  const dataObject = {
    value: contextValue,
    rawValue: contextValue
  }

  if (isCurrency(context)) {
    dataObject.value = getFormattedPrice(contextValue)
  }

  return dataObject
}

/**
 * returns date value of context
 */
function getDateValue(deal: IDeal, context: IDealBrandContext) {
  const date = getField(deal, context.key)

  return {
    value: date ? parseDate(date).format(getDateFormatString()) : ''
  }
}

function parseDate(date: number) {
  return moment.unix(date).utc()
}

function getDateFormatString() {
  return 'MMM DD, YYYY'
}

/**
 * returns check context is currency
 */
function isCurrency(field: IDealBrandContext) {
  return ['list_price', 'sales_price'].indexOf(field.key) > -1
}
