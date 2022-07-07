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
      color: theme.palette.error.main
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

  const isTaskDone = task.status === 'DONE'

  const [remainingDays, remainingHours, fromNow] = useMemo(() => {
    const today = moment()
    const taskDate = moment.unix(task.due_date)

    return [
      taskDate.diff(today, 'days'),
      taskDate.diff(today, 'hours'),
      taskDate.fromNow(true)
    ]
  }, [task.due_date])

  const normalizeMessage = (message: string) => {
    if (message === 'in a day') {
      return 'Tomorrow'
    }

    if (message === 'a day ago') {
      return 'Yesterday'
    }

    return message
  }

  if (remainingDays < 0) {
    return (
      <div className={cn(classes.past, { [classes.done]: isTaskDone })}>
        <span>{normalizeMessage(`${fromNow} ago`)}</span>
      </div>
    )
  }

  if (
    (remainingDays === 0 && remainingHours < 24) ||
    (remainingDays > 0 && remainingDays < 7)
  ) {
    return (
      <div className={cn(classes.soon, { [classes.done]: isTaskDone })}>
        {normalizeMessage(`in ${fromNow}`)}
      </div>
    )
  }

  return (
    <div className={cn(classes.date, { [classes.done]: isTaskDone })}>
      {moment.unix(task.due_date).format('ddd, MMM DD, YYYY')}
    </div>
  )
}
