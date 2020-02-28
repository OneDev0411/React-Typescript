import React from 'react'

import { formatDate } from 'components/DateTimePicker/helpers'

import { isEmailInProgress, isEmailScheduled } from '../helpers'

interface Props {
  data: IEmailCampaign
}

function DateColumn({ data }: Props) {
  const isScheduled: boolean = isEmailScheduled(data)
  const isInProgress: boolean = isEmailInProgress(data)

  let date: string

  if (isScheduled || isInProgress) {
    date = formatDate(new Date(data.due_at * 1000))
  } else if (data.executed_at) {
    date = formatDate(new Date(data.executed_at * 1000))
  } else {
    date = '-'
  }

  return <span>{isScheduled ? `Scheduled for ${date}` : date}</span>
}

export default DateColumn
