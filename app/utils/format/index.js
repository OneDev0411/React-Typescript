import moment from 'moment'

export function formatDate(date, pattern = 'MM/DD/YYYY') {
  if (!date) {
    return ''
  }

  const formatedDate = moment.utc(date * 1000).format(pattern)

  return moment(formatedDate).isValid() ? formatedDate : ''
}

/**
 * Format a US phone number to something like this +1 (123) 456-7890
 * NOTE: It returns an invalid string as same as getting it.
 * @param {String} phoneNumber 
 * @return {String}
 */
export function formatPhoneNumber(phoneNumber) {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '')
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)

  if (match) {
    const intlCode = (match[1] ? '+1 ' : '')
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
  }
  
  return phoneNumber
}