import { useMemo } from 'react'

import { makeStyles, Theme } from '@material-ui/core'
import moment from 'moment'

const useStyles = makeStyles(
  (theme: Theme) => ({
    soon: {
      fontWeight: 600,
      color: theme.palette.success.main
    },
    past: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: theme.palette.grey[400]
    },
    pastDue: {
      display: 'inline-block',
      padding: theme.spacing(0.25, 0.5),
      color: theme.palette.error.main,
      backgroundColor: theme.palette.error.ultralight,
      borderRadius: '30px',
      ...theme.typography.body3
    },
    date: {
      color: theme.palette.grey[700]
    }
  }),
  {
    name: 'Tasks-DueDateCell'
  }
)

interface Props {
  dueDate: number
}

export function DueDateCell({ dueDate }: Props) {
  const classes = useStyles()

  const [remainingDays, remainingHours, fromNow] = useMemo(() => {
    const today = moment()
    const taskDate = moment.unix(dueDate)

    return [
      taskDate.diff(today, 'days'),
      taskDate.diff(today, 'hours'),
      taskDate.fromNow(true)
    ]
  }, [dueDate])

  if (remainingDays < 0) {
    return (
      <div className={classes.past}>
        <span>{fromNow} ago</span>{' '}
        <span className={classes.pastDue}>Past Due</span>
      </div>
    )
  }

  if (remainingDays === 0 && remainingHours < 24) {
    return <div className={classes.soon}>in {remainingHours} hours</div>
  }

  if (remainingDays > 0 && remainingDays < 7) {
    return <div className={classes.soon}>in {fromNow}</div>
  }

  return (
    <div className={classes.date}>
      {moment.unix(dueDate).format('ddd, MMM DD, YYYY')}
    </div>
  )
}
