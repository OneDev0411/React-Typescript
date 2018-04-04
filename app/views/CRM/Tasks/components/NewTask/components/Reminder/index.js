import React from 'react'

import DateTimeField from '../DateTimeField'
import { getTodayDate } from '../../helpers/get-today-date'
import { getTime } from '../../../../../../../utils/get-time'
import { getTimes } from '../../../../../../../utils/get-times'

const oneDay = 24 * 3600 * 1000
const today = getTodayDate()

const getItems = (dueDate = today, selectedDate) => {
  const timeDifference = getTimeDifference(dueDate)
  let items = [
    {
      title: 'The day of',
      value: dueDate
    }
  ]

  const theDayBeforeOption = {
    title: 'The day before',
    value: offsetDate(dueDate, -1)
  }

  const customDateOption = {
    title: 'Custom Date',
    needsDatePicker: true,
    value: selectedDate.value || offsetDate(dueDate, -1)
  }

  if (timeDifference >= 1) {
    items.push(theDayBeforeOption)
  }

  if (timeDifference >= 7) {
    items.push({
      title: 'The week before',
      value: offsetDate(dueDate, -7)
    })
  }

  // just for ordering dropdown options
  // pushed this before the week before option
  if (timeDifference >= 2) {
    items.push(customDateOption)
  }

  items.push({
    title: 'No reminder',
    value: null
  })

  return items
}

export default function Reminder({ dueDate, dueTime, selectedDate }) {
  const dateItems = getItems(dueDate, selectedDate)
  const now = getTime(new Date().getTime())
  const timeItems = getTimes().filter(
    time =>
      !dueTime ||
      selectedDate.value !== dueDate ||
      (dueDate === today
        ? time.value < dueTime && time.value >= now
        : time.value < dueTime)
  )

  return (
    <DateTimeField
      id="reminder"
      name="reminder"
      title="Reminder"
      dateItems={dateItems}
      timeItems={timeItems}
      selectedDate={selectedDate}
      isRequired={typeof selectedDate.value === 'number'}
      datePickerModifiers={{
        disabled: {
          before: new Date(),
          after: new Date(dueDate)
        }
      }}
    />
  )
}

/**
 *
 * @param {number} timestamp original date in timestamp
 * @param {number} offset offset in days
 */
function offsetDate(timestamp, offset) {
  return timestamp + offset * oneDay
}

/**
 *
 * @param {number} timestamp original date in timestamp
 * @returns {number} Time difference in days
 */
function getTimeDifference(dueDate) {
  const difference = dueDate - today

  if (difference <= 0) {
    return 0
  }

  return Math.round((dueDate - today) / oneDay)
}
