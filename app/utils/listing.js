import { round } from './helpers'

const ONE_ACRE_TO_SQUARE_METERS = 4046.86
const ONE_SQUARE_METRE_TO_ONE_SQUARE_FOOT = 10.7639

export const getStatusColor = status => {
  switch (status) {
    case 'Active':
    case 'Lease':
      return '32b86d'

    case 'Pending':
    case 'Active Kick Out':
    case 'Active Contingent':
    case 'Active Option Contract':
    case 'Lease Contract':
      return 'f5a544'

    case 'Sold':
    case 'Leased':
    case 'Expired':
    case 'Cancelled':
      return 'd00023'

    default:
      return 'c3c3c3'
  }
}

export const getStatusColorClass = status => {
  switch (status) {
    case 'Active':
    case 'Lease':
      return 'green'

    case 'Pending':
    case 'Active Kick Out':
    case 'Active Contingent':
    case 'Active Option Contract':
    case 'Lease Contract':
      return 'orange'

    case 'Sold':
    case 'Leased':
    case 'Expired':
    case 'Archived':
    case 'Cancelled':
      return 'red'

    case 'Withdrawn':
    case 'Temp Off Market':
    case 'Withdrawn Sublisting':
      return '#62778c'

    default:
      return ''
  }
}

export const metersToAcres = metre => metre / ONE_ACRE_TO_SQUARE_METERS
export const acresToMeters = acres => acres * ONE_ACRE_TO_SQUARE_METERS

export const metersToFeet = metre => metre * ONE_SQUARE_METRE_TO_ONE_SQUARE_FOOT

export const feetToMeters = foot => foot / ONE_SQUARE_METRE_TO_ONE_SQUARE_FOOT

export const localAddress = address =>
  `${address.street_number} ${address.street_name} ST ${address.unit_number}`

export const addressTitle = address =>
  `${address.street_number} ${address.street_name} ${address.street_suffix} ${
    address.unit_number ? `Unit ${address.unit_number}` : ''
  }`

export const getListingAddress = address => {
  if (!address) {
    throw new Error('address parameter in empty')
  }

  const { street_number, street_name, street_suffix, unit_number } = address

  let result = [street_number, street_name, street_suffix]
    .filter(s => s)
    .join(' ')

  if (unit_number) {
    result += ` Unit ${address.unit_number}`
  }

  return result
}

export const getDOM = dom => Math.floor(dom)
// return Math.floor((((new Date()).getTime() / 1000) - dom_seconds) / 86400)

export const shortPrice = price => {
  // The round function works with precision. We want three number regardless af point place. The below algorithm change number to have two number after point, then round it. After it change it back.
  const decimalLength = Math.pow(10, price.toString().split('.')[0].length - 1)
  let price_small = round(price / decimalLength, 2)

  const letter = price_small * decimalLength >= 1000000 ? 'm' : 'k'
  const factor = price_small * decimalLength >= 1000000 ? 1000000 : 1000

  price_small *= decimalLength / factor

  // if decimalLength / factor is more than one, the price_small would have not rounded anymore.
  // 8.62*100/10 =86.19999999999999
  // the blow condition fix it.
  if (decimalLength / factor > 1) {
    price_small = round(price_small, 0)
  }

  // Below conditions force price to have 3 three numbers. This done by adding zero after the point
  if (Number.isInteger(price_small) && price_small.toString().length < 3) {
    price_small += '.'
  }

  if (!Number.isInteger(price_small) && price_small.toString().length < 4) {
    price_small += '0'.repeat(4 - price_small.toString().length)
  }

  return price_small + letter
}

export const getResizeUrl = full_size_url => full_size_url || ''
// if (!full_size_url) { return '' }
// let image_replace = full_size_url.replace('http://cdn.rechat.co/', '')
// image_replace = image_replace.replace('http://cdn.rechat.co/', '')
// image_replace = image_replace.replace('https://cdn.rechat.co/', '')
// image_replace = image_replace.replace('https://cdn.rechat.com/', '')
// const imgix_url = `https://rechat.imgix.net/${image_replace}`
// return imgix_url

export const squareMetersToAcres = value => value * 0.000247105

export default {
  getStatusColor,
  getStatusColorClass,
  metersToFeet,
  feetToMeters,
  localAddress,
  addressTitle,
  getDOM,
  shortPrice,
  getResizeUrl,
  squareMetersToAcres
}
