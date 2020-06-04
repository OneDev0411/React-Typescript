import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core'

import { formatDate } from 'components/DateTimePicker/helpers'

import { isEmailInProgress, isEmailScheduled } from '../helpers'

interface Props {
  data: IEmailCampaign
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.palette.grey[500]
    }
  })
)

function DateColumn({ data }: Props) {
  const classes = useStyles()
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

  return (
    <span className={classes.container}>
      {isScheduled ? `Scheduled for ${date}` : date}
    </span>
  )
}

export default DateColumn
