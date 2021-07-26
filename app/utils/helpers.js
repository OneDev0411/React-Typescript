export function createUrlSearch(params, filter, encode = false) {
  const queryString = Object.keys(params)
    .filter(key => {
      const value = params[key]

      if (typeof filter === 'function') {
        return filter(value)
      }

      // Filtering null, undefined, NaN and empty string values
      return (
        (typeof value === 'number' && !Number.isNaN(value)) ||
        typeof value === 'boolean' ||
        Boolean(value)
      )
    })
    .map(
      key => `${key}=${encode ? encodeURIComponent(params[key]) : params[key]}`
    )
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
    return -1
  }

  if (a > b) {
    return 1
  }

  // a must be equal to b
  return 0
}

export function joinItemsWithString(items = [], string = ', ') {
  return items.filter(i => typeof i === 'string').join(string)
}

export function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
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
    .map(word =>
      /^[A-Za-z\s]+$/.test(word) ? word.charAt(0).toUpperCase() : ''
    )
    .join('')
    .trim()
    .substring(0, length)

  if (nameInitials) {
    return nameInitials
  }

  // Otherwise, return first letter occurrence,
  // for cases that only the email address is available:
  const match = name.match(/[a-zA-Z]/)

  return match ? match[0].toUpperCase() : '\u00A0'
}

export function getPlaceholderImage(
  text,
  options = {
    size: '160x160',
    format: 'jpg',
    color: 'ffffff',
    backgroundColor: 'd4d4d4'
  }
) {
  return `https://via.placeholder.com/${options.size}.${options.format}/${
    options.backgroundColor
  }/${options.color}?text=${encodeURIComponent(text)}`
}

export function getNameInitialsPlaceholderImage(name = 'Rechat User') {
  const initials = getNameInitials(name)

  return getPlaceholderImage(initials)
}

export async function getPhoneNumberUtil() {
  const { PhoneNumberUtil } = await import(
    'google-libphonenumber' /* webpackChunkName: "glpn" */
  )

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

export function numberWithCommas(x) {
  if (typeof x === 'number') {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return ''
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

  const { PhoneNumberFormat } = await import(
    'google-libphonenumber' /* webpackChunkName: "glpn" */
  )

  return phoneUtil.format(parsed, PhoneNumberFormat.NATIONAL)
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

export function isNumeric(n) {
  // eslint-disable-next-line no-restricted-globals
  return !isNaN(parseFloat(n)) && isFinite(n)
}

// Translates an index to a label consisting of English letters
// Initially we had a simple function which returned up to 26 letters but
// apparently we wanted more:
// https://gitlab.com/rechat/web/-/issues/3922#note_303292408
export function getIndexLabel(index) {
  index = (parseInt('ooooooop0', 26) + index).toString(26)

  return index.slice(index.indexOf('p') + 1).replace(/./g, c => {
    c = c.charCodeAt(0)

    return String.fromCharCode(c < 64 ? c + 17 : c - 22)
  })
}

export function noop() {}
