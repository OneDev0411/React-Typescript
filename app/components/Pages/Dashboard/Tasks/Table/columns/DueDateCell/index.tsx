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
      fontWeight: 500,
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
  const today = moment()
  const taskDate = moment.unix(task.due_date)

  if (taskDate.isAfter(today.clone().add(7, 'days'))) {
    return (
      <div className={cn(classes.date, { [classes.done]: isTaskDone })}>
        {moment.unix(task.due_date).format('ddd, MMM DD, YYYY')}
      </div>
    )
  }

  return (
    <div
      className={cn(classes.soon, {
        [classes.past]: taskDate.isBefore(today),
        [classes.done]: isTaskDone
      })}
    >
      {taskDate.fromNow()}
    </div>
  )
}
