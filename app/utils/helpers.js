export function createUrlSearch(params, filter) {
  const queryString = Object.keys(params)
    .filter(key => {
      const value = params[key]

      if (typeof filter === 'function') {
        return filter(value)
      }

      // Filtering null, undefined, NaN and empty string values
      return (typeof value === 'number' && !Number.isNaN(value)) ||
        typeof value === 'boolean' ||
        Boolean(value)
    })
    .map(key => `${key}=${params[key]}`)
    .join('&')

  if (queryString.length > 0) {
    return `?${queryString}`
  }

  return ''
}

export function sortAlphabetically(a, b) {
  return compare(a.toLowerCase(), b.toLowerCase())
}

export function compare(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  // a must be equal to b
  return 0;
}

export function compareNumbers(a, b) {
  return a - b;
}

export function joinItemsWithString(items = [], string = ', ') {
  return items.filter(i => typeof i === 'string').join(string)
}

export function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

export function uppercaseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getNameInitials(name, length = 2) {
  if (!name) {
    return
  }

  const nameInitials = name
    .split(/[\s\n]/)
    .map(word => /^[A-Za-z\s]+$/.test(word) ? word.charAt(0).toUpperCase() : '')
    .join('')
    .trim()
    .substring(0, length)

  if (nameInitials) return nameInitials

  // Otherwise, return first letter occurrence,
  // for cases that only the email address is available:
  const match = name.match(/[a-zA-Z]/)

  return match ? match[0].toUpperCase() : '\u00A0'
}

export function getPlaceholderImage(text, options = {
  size: '160x160',
  format: 'jpg',
  color: 'ffffff',
  backgroundColor: 'd4d4d4'
}) {
  return `https://via.placeholder.com/${options.size}.${options.format}/${options.backgroundColor}/${options.color}?text=${encodeURIComponent(text)}`
}

export function getNameInitialsPlaceholderImage(name = 'Rechat User') {
  const initials = getNameInitials(name)

  return getPlaceholderImage(initials)
}

export async function getPhoneNumberUtil() {
  const {
    PhoneNumberUtil,
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

  return results === null
    ? ''
    : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

export function prepareToken(token) {
  return decodeURIComponent(token).replace(' ', '+')
}

export function convertDateToTimefunction(date) {
  let date_arr = date.split('-')
  let time =
    new Date(date_arr[0], date_arr[1] - 1, date_arr[2]).getTime() / 1000

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
  if (typeof x === 'number') {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return ''
}

export function getDaysFromMiliseconds(miliseconds) {
  return Math.floor(parseInt(miliseconds) / 86400000)
}

export async function isValidPhoneNumber(phone_number) {
  const phoneUtil = await getPhoneNumberUtil()

  if (!phone_number.trim()) {
    return false
  }

  try {
    return phoneUtil.isValidNumber(phoneUtil.parse(phone_number, 'US'))
  } catch (e) {
    return false
  }
}

export async function formatPhoneNumber(input) {
  const phoneUtil = await getPhoneNumberUtil()
  const parsed = phoneUtil.parse(input, 'US')

  const {
    PhoneNumberFormat
  } = await import('google-libphonenumber' /* webpackChunkName: "glpn" */)

  return phoneUtil.format(parsed, PhoneNumberFormat.NATIONAL)
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

//  For using math round
//  This proposed solution avoids the floating-number arithmetic issue
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round#A_better_solution
export function round(number, precision) {
  const shift = function (number, precision) {
    const numArray = `${number}`.split('e')

    return +`${numArray[0]}e${
      numArray[1] ? +numArray[1] + precision : precision
      }`
  }

  return shift(Math.round(shift(number, +precision)), -precision)
}

export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// Translates an index to a label consisting of English letters
// Initially we had a simple function which returned up to 26 letters but
// apparently we wanted more:
// https://gitlab.com/rechat/web/-/issues/3922#note_303292408
export function getIndexLabel(index) {
  index = (parseInt("ooooooop0", 26) + index).toString(26);
  return index.slice(index.indexOf("p") + 1).replace(/./g, c => {
    c = c.charCodeAt(0);
    return String.fromCharCode(c < 64 ? c + 17 : c - 22);
  });
}

export function noop() { }
