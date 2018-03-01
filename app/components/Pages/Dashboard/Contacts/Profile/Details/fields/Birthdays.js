import React from 'react'
import { format } from 'fecha'
import MultiFields from '../components/MultiFields'

export default function Birthdays({ contact }) {
  const validator = date => {
    /*
      Match dates (M/D/YY, M/D/YYY, MM/DD/YY, MM/DD/YYYY)
      This regex will match a string as a date in the formats
      M/D/YY, M/D/YYY, MM/DD/YY, and MM/DD/YYYY.
      It does not correct for leap year.
    */

    const regular = /^((0?[13578]|10|12)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[01]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1}))|(0?[2469]|11)(-|\/)(([1-9])|(0[1-9])|([12])([0-9]?)|(3[0]?))(-|\/)((19)([2-9])(\d{1})|(20)([01])(\d{1})|([8901])(\d{1})))$/

    return new RegExp(regular).exec(date)
  }

  const handleFormat = unix_timestamp => {
    if (!unix_timestamp) {
      return unix_timestamp
    }

    return format(unix_timestamp * 1000, 'MM/DD/YYYY')
  }

  const handleParse = date => new Date(date).getTime() / 1000

  return (
    <MultiFields
      isSingle
      type="birthday"
      name="birthdays"
      title="Birthday"
      contact={contact}
      validator={validator}
      placeholder="MM/DD/YYYY"
      handleParse={handleParse}
      handleFormat={handleFormat}
      validationText="Invalid format. Valid format MM/DD/YYYY"
    />
  )
}
