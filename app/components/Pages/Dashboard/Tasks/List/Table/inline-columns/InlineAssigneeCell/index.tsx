import { makeStyles } from '@material-ui/core'

import { useTaskMutation } from '../../../../queries/use-task-mutation'
import type { ITask } from '../../../../types'
import { AssigneesList } from '../../../components/AssigneesList'

const useStyles = makeStyles(
  () => ({
    root: {
      maxHeight: '200px',
      overflow: 'auto'
    }
  }),
  {
    name: 'Tasks-InlineAssigneeCell'
  }
)

interface Props {
  task: ITask
  closeHandler: () => void
}

export function InlineAssigneeCell({ task, closeHandler }: Props) {
  const mutation = useTaskMutation(task)

  const classes = useStyles()

  const onChange = (nextAssignees: IUser[]) => {
    mutation.mutate({
      assignees: nextAssignees
    })
  }

  return (
    <div className={classes.root}>
      <AssigneesList
        defaultAssignees={task.assignees ?? []}
        onChange={onChange}
      />
    </div>
  )
}
