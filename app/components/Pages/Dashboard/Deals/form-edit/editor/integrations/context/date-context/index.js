import React from 'react'
import moment from 'moment'

import DatePicker from '../../../../../../../../../views/components/DatePicker'
import DealContext from '../../../../../../../../../models/DealContext'

function onDateChange(props, value) {
  const formattedValue = moment(value).format(DealContext.getDateFormatString())

  return props.onContextChange(value, formattedValue)
}

function getSelectedDate(props) {
  if (props.value) {
    return props.value
  } else if (props.defaultValue) {
    return new Date(props.defaultValue * 1000)
  }

  return new Date()
}

export default function DateContext(props) {
  return (
    <DatePicker
      onChange={value => onDateChange(props, value)}
      selectedDate={getSelectedDate(props)}
    />
  )
}
