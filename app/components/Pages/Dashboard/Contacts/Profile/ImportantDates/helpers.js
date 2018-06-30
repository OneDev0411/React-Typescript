import moment from 'moment'

export const validator = date => {
  /*
    Match dates (M/D/YY, M/D/YYY, MM/DD/YY, MM/DD/YYYY)
    This regex will match a string as a date in the formats
    M/D/YY, M/D/YYY, MM/DD/YY, and MM/DD/YYYY.
    It does not correct for leap year.
  */

  const regular = /^((0?[13578]|10|12)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[01]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1}))|(0?[2469]|11)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[0]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1})))$/

  return new RegExp(regular).exec(date)
}

export const format = unix_timestamp => {
  if (typeof unix_timestamp === 'number') {
    return moment.utc(unix_timestamp * 1000).format('MM/DD/YYYY')
  }

  if (typeof unix_timestamp === 'string' && validator(unix_timestamp)) {
    return unix_timestamp
  }

  return null
}

export const parse = date => moment.utc(date).unix()
