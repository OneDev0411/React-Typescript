async function getPhoneNumberUtil() {
  const {
    PhoneNumberUtil
  } = await import('google-libphonenumber' /* webpackChunkName: "glpn" */)

  return PhoneNumberUtil.getInstance()
}

export function randomString(len, charSet) {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

  let randomString = ''

  for (let i = 0; i < len; i++) {
    let randomPoz = Math.floor(Math.random() * charSet.length)

    randomString += charSet.substring(randomPoz, randomPoz + 1)
  }

  return randomString
}

export function getParameterByName(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')

  let regex = new RegExp(`[\\?&]${name}=([^&#]*)`),
    results = regex.exec(location.search)

  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

export function prepareToken(token) {
  return decodeURIComponent(token).replace(' ', '+')
}

export function convertDateToTimefunction(date) {
  let date_arr = date.split('-')
  let time = new Date(date_arr[0], date_arr[1] - 1, date_arr[2]).getTime() / 1000

  return time
}

export function friendlyDate(seconds_timestamp) {
  let a = new Date(seconds_timestamp * 1000)
  let months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  let days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']
  let year = a.getFullYear()
  let month = months[a.getMonth()]
  let day = days[a.getDay()]
  let date = a.getDate()
  let hour = a.getHours()
  let min = a.getMinutes()
  let sec = a.getSeconds()
  let time_friendly = getTime(a)
  let time = {
    day,
    date,
    month,
    year,
    hour,
    min,
    sec,
    time_friendly
  }

  return time
}

export function getTimeAgo(time) {
  let units = [
    { name: 'second', limit: 60, in_seconds: 1 },
    { name: 'minute', limit: 3600, in_seconds: 60 },
    { name: 'hour', limit: 86400, in_seconds: 3600 },
    { name: 'day', limit: 604800, in_seconds: 86400 },
    { name: 'week', limit: 2629743, in_seconds: 604800 },
    { name: 'month', limit: 31556926, in_seconds: 2629743 },
    { name: 'year', limit: null, in_seconds: 31556926 }
  ]
  var diff = (new Date() - new Date(time * 1000)) / 1000

  if (diff < 5) {
    return 'now'
  }

  let i = 0,
    unit

  while ((unit = units[i++])) {
    if (diff < unit.limit || !unit.limit) {
      var diff = Math.floor(diff / unit.in_seconds)

      return `${diff} ${unit.name}${diff > 1 ? 's' : ''}`
    }
  }
}

export function getTime(date) {
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let ampm = hours >= 12 ? 'pm' : 'am'

  hours %= 12
  hours = hours || 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? `0${minutes}` : minutes

  let strTime = `${hours}:${minutes}${ampm}`

  return strTime
}

export function getYMD(timestamp) {
  let date = new Date()

  if (timestamp) {
    date = new Date(timestamp)
  }

  return `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(
    -2
  )}-${`0${date.getDate()}`.slice(-2)}`
}

export function numberWithCommas(x) {
  if (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}

export function getDaysFromMiliseconds(miliseconds) {
  return Math.floor(parseInt(miliseconds) / 86400000)
}

export async function isValidPhoneNumber(phone_number) {
  const phoneUtil = await getPhoneNumberUtil()

  if (
    phone_number.trim() &&
    phoneUtil.isValidNumber(phoneUtil.parse(phone_number))
  ) {
    return true
  }

  return false
}

export function imageExists(url) {
  let img = new Image()

  img.src = url

  return img.height != 0
}

export function addTimeToDate(date_object, hours, minutes, suffix) {
  let date_miliseconds = date_object.getTime() // in miliseconds

  // Get time
  if (hours === 0) {
    hours = 12
  }

  if (suffix === 'PM' && hours !== 12) {
    hours += 12
  }

  if (suffix === 'AM' && hours === 12) {
    hours = 0
  }

  const seconds_after_midnight = hours * 60 * 60 + minutes * 60
  const miliseconds = date_miliseconds + seconds_after_midnight * 1000

  return miliseconds
}

export async function parsePhoneNumber(phone_number) {
  const phoneUtil = await getPhoneNumberUtil()

  if (phone_number && phoneUtil.isPossibleNumberString(phone_number)) {
    const values = phoneUtil.parse(phone_number).values_

    return {
      country_code: values[1],
      phone_number: values[2]
    }
  }

  return {
    country_code: 1,
    phone_number
  }
}

export function isValidUSZip(zip) {
  return /^\d{5}(-\d{4})?$/.test(zip)
}

/**
 * Return requested field value from truth source
 * @param {Object} deal
 * @param {String} field
 * @return {Any}
 */
export const getFieldValue = (deal, field) => {
  if (deal.context && deal.context[field]) {
    return deal.context[field]
  } else if (deal.proposed_values && deal.proposed_values[field]) {
    return deal.proposed_values[field]
  }

  return null
}

export const hasRecipients = recipients => {
  const recps = []
    .concat(recipients.users, recipients.emails, recipients.phone_numbers)
    .filter(recp => recp !== undefined)

  return recps.length > 0
}

export const toNumber = (value, formated = false) => {
  if (typeof value !== 'string') {
    return
  }

  value = Number(value.replace(/[^0-9.]/g, ''))

  if (formated) {
    value = value.toLocaleString()
  }

  return value
}
