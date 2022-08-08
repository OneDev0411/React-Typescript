import { TypesList } from '../../../components/TypesList'
import { useTaskMutation } from '../../../queries/use-task-mutation'
import type { ITask } from '../../../types'

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
    <TypesList selectedItem={task.task_type} onSelectItem={handleSelectItem} />
  )
}
