import { formatNumber } from 'libphonenumber-js'

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
  }).format(area_meters * 10.7639)
}

export function phoneNumberFilter(phone) {
  if (!phone) {
    return ''
  }

  return formatNumber(phone, 'National')
}
