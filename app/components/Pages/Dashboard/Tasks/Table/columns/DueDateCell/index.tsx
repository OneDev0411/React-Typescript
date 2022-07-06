import { useMemo } from 'react'

import { makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'
import moment from 'moment'

import type { ITask } from '../../../types'

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
    },
    done: {
      color: theme.palette.grey[400]
    }
  }),
  {
    name: 'Tasks-DueDateCell'
  }
)

interface Props {
  task: ITask
}

export function DueDateCell({ task }: Props) {
  const classes = useStyles()

  const [remainingDays, remainingHours, fromNow] = useMemo(() => {
    const today = moment()
    const taskDate = moment.unix(task.due_date)

    return [
      taskDate.diff(today, 'days'),
      taskDate.diff(today, 'hours'),
      taskDate.fromNow(true)
    ]
  }, [task.due_date])

  if (remainingDays < 0) {
    return (
      <div className={classes.past}>
        <span>{fromNow} ago</span>{' '}
        {task.status !== 'DONE' && (
          <span className={classes.pastDue}>Past Due</span>
        )}
      </div>
    )
  }

  if (
    (remainingDays === 0 && remainingHours < 24) ||
    (remainingDays > 0 && remainingDays < 7)
  ) {
    return (
      <div
        className={cn(classes.soon, { [classes.done]: task.status === 'DONE' })}
      >
        in {fromNow}
      </div>
    )
  }

  return (
    <div
      className={cn(classes.date, { [classes.done]: task.status === 'DONE' })}
    >
      {moment.unix(task.due_date).format('ddd, MMM DD, YYYY')}
    </div>
  )
}
