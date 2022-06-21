import { MenuItem } from '@material-ui/core'

import { useTaskMutation } from '../../../queries/use-task-mutation'
import type { ITask } from '../../../types'

import { TaskTypeOptions } from './options'

interface Props {
  task: ITask
  closeHandler: () => void
}

export function InlineTypeCell({ task, closeHandler }: Props) {
  const mutation = useTaskMutation(task)

  const handleSelectItem = (value: CRMTaskTypes) => {
    mutation.mutate({
      task_type: value
    })

    closeHandler()
  }

  return (
    <>
      {TaskTypeOptions.map(({ label, value }) => (
        <MenuItem
          key={value}
          selected={value === task.task_type}
          onClick={() => handleSelectItem(value)}
        >
          {label}
        </MenuItem>
      ))}
    </>
  )
}
