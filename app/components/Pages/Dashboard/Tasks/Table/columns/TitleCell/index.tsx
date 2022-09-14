import { makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'

import { ITask } from '../../../types'
import { DeleteCell } from '../DeleteCell'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      color: 'inherit',
      width: '100%',
      '&.done': {
        color: theme.palette.grey[400]
      }
    }
  }),
  {
    name: 'Tasks-TitleCell'
  }
)

interface Props {
  task: ITask
}

export function TitleCell({ task }: Props) {
  const classes = useStyles()

  return (
    <div
      className={cn(classes.root, 'overflow-ellipsis', {
        done: task.status === 'DONE'
      })}
    >
      <DeleteCell task={task} />
      {task.title}
    </div>
  )
}
