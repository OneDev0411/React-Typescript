import { makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'

import { muiIconSizes } from '@app/views/components/SvgIcons'
import { eventTypesIcons } from '@app/views/utils/event-types-icons'

import type { ITask } from '../../../types'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      '&.done': {
        color: theme.palette.grey[400]
      }
    },
    type: {
      marginLeft: theme.spacing(1)
    }
  }),
  {
    name: 'Tasks-TaskTypeCell'
  }
)

interface Props {
  task: ITask
}

export function TaskTypeCell({ task }: Props) {
  const classes = useStyles()

  return (
    <div className={cn(classes.root, { done: task.status === 'DONE' })}>
      {eventTypesIcons[task.task_type]?.icon({
        size: muiIconSizes.small
      })}

      <div className={classes.type}>{task.task_type}</div>
    </div>
  )
}
