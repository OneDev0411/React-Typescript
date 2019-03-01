import moment from 'moment'
import _ from 'lodash'

import { formatPhoneNumber } from 'utils/format'

export function currencyFilter(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

export function areaMeterFilter(area_meters) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.floor(area_meters * 10.7639))
}

export function phoneNumberFilter(phone) {
  if (!phone) {
    return ''
  }

  return formatPhoneNumber(phone)
}

export function formatDate(date, kwargs = {}) {
  const { format = 'dddd, MMMM D, YYYY @ hh:mm A' } = kwargs

  return moment(date).format(format)
}
