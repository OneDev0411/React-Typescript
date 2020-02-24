import React from 'react'

import { formatDate } from 'components/DateTimePicker/helpers'

import { isEmailInProgress, isEmailScheduled } from '../helpers'

function DateColumn({ data }) {
  const isScheduled = isEmailScheduled(data)
  const isInProgress = isEmailInProgress(data)

  const date =
    isScheduled || isInProgress
      ? formatDate(new Date(data.due_at * 1000))
      : formatDate(new Date(data.executed_at * 1000))

  return <span>{isScheduled ? `Scheduled for ${date}` : date}</span>
}

export default DateColumn
