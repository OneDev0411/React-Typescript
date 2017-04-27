import helpers from './helpers'
export default {
  getStatusColor: status => {
    let status_color = 'c3c3c3'
    if (status) {
      if (status === 'Active')
        status_color = '35b863'
      if (status === 'Active Option Contract' || status === 'Active Contingent' || status === 'Active Kick Out' || status === 'Pending')
        status_color = 'f8b619'
      if (status === 'Expired' || status === 'Sold' || status === 'Cancelled' || status === 'Leased')
        status_color = 'db3821'
    }
    return status_color
  },
  getStatusColorClass: status => {
    let status_color_class = ''
    if (status) {
      if (status === 'Active')
        status_color_class = 'green'
      if (status === 'Active Option Contract' || status === 'Active Contingent' || status === 'Active Kick Out' || status === 'Pending')
        status_color_class = 'orange'
      if (status === 'Expired' || status === 'Sold' || status === 'Cancelled' || status === 'Leased')
        status_color_class = 'red'
    }
    return status_color_class
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
    return `${address.street_number} ${address.street_name} ${address.street_suffix} ${address.unit_number ? 'Unit ' + address.unit_number : ''}`
  },
  getDOM: dom => {
    return Math.floor(dom)
    // return Math.floor((((new Date()).getTime() / 1000) - dom_seconds) / 86400)
  },
  getSmallPrice: price => {
    let price_small = Math.floor(price / 1000).toFixed(2).replace(/[.,]00$/, '')
    let letter = 'k'
    if (price_small > 1000) {
      price_small = (price_small / 1000).toFixed(2).replace(/[.,]00$/, '')
      letter = 'm'
    }
    return price_small + letter
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
  squareMetersToAcres(value){
    return value * 0.000247105
  }
}