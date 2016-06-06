import helpers from './helpers'
export default {
  getStatusColor: status => {
    let status_color = 'c3c3c3'
    if (status) {
      if (status === 'Active')
        status_color = '35b863'
      if (status === 'Active Contingent')
        status_color = 'f8b619'
      if (status === 'Expired' || status === 'Sold')
        status_color = 'db3821'
    }
    return status_color
  },
  metersToFeet: meters => {
    return Math.round(meters * '10.7639')
  },
  feetToMeters: feet => {
    return Math.round(feet / '10.7639')
  },
  localAddress: address => {
    return address.street_number + ' ' + address.street_name + ' ST ' + address.unit_number
  },
  addressTitle: address => {
    return `${address.street_number} ${address.street_name} ${address.street_suffix}`
  },
  getDOM: dom_seconds => {
    return Math.floor((((new Date()).getTime() / 1000) - dom_seconds) / 86400)
  },
  getResizeUrl(full_size_url) {
    if (!full_size_url)
      return ''
    let image_replace = full_size_url.replace('http://cdn.rechat.co/','')
    image_replace = image_replace.replace('http://cdn.rechat.co/','')
    image_replace = image_replace.replace('https://cdn.rechat.co/','')
    image_replace = image_replace.replace('https://cdn.rechat.com/','')
    const imgix_url = 'https://rechat.imgix.net/' + image_replace
    return imgix_url
    // TODO handle image not found
    // var img = new Image();
    // img.src = imgix_url
    // if (img.height !== 0)
    //   return imgix_url
    // else
    //   return full_size_url
  },
  alertOptionsShort(alert) {
    return `${(alert.property_subtypes.length < 5) ? alert.property_subtypes.toString().replace(new RegExp('RES-', 'g'), ' ').trim() : 'All types'}, $${helpers.numberWithCommas(alert.minimum_price)}-$${helpers.numberWithCommas(alert.maximum_price)}, Min ${alert.minimum_bedrooms} Beds ${alert.minimum_bathrooms} Baths`
  }
}