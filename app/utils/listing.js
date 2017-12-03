const ONE_SQUARE_METRE_TO_ONE_SQUARE_FOOT = 10.7639

export const getStatusColor = status => {
  switch (status) {
    case 'Active':
      return '32b86d'

    case 'Pending':
    case 'Active Kick Out':
    case 'Active Contingent':
    case 'Active Option Contract':
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
      return 'green'

    case 'Pending':
    case 'Active Kick Out':
    case 'Active Contingent':
    case 'Active Option Contract':
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

export const metersToFeet = metre => metre * ONE_SQUARE_METRE_TO_ONE_SQUARE_FOOT

export const feetToMeters = foot => foot / ONE_SQUARE_METRE_TO_ONE_SQUARE_FOOT

export const localAddress = address =>
  `${address.street_number} ${address.street_name} ST ${address.unit_number}`

export const addressTitle = address =>
  `${address.street_number} ${address.street_name} ${address.street_suffix} ${
    address.unit_number ? `Unit ${address.unit_number}` : ''
  }`

export const getDOM = dom => Math.floor(dom)
// return Math.floor((((new Date()).getTime() / 1000) - dom_seconds) / 86400)

export const getSmallPrice = price => {
  let price_small = Math.floor(price / 1000)
    .toFixed(2)
    .replace(/[.,]00$/, '')
  let letter = 'k'

  if (price_small > 1000) {
    price_small = (price_small / 1000).toFixed(2).replace(/[.,]00$/, '')
    letter = 'm'
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
  getSmallPrice,
  getResizeUrl,
  squareMetersToAcres
}
