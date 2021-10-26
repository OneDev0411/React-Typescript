import { IAppState } from '@app/reducers'
import { selectChecklistTasks } from '@app/reducers/deals/tasks'
import { createTask, changeNeedsAttention } from 'actions/deals'
import { addNotification as notify } from 'components/notification'
import { createTaskComment } from 'deals/utils/create-task-comment'

interface CreateRequestTask {
  checklist: IDealChecklist
  userId: UUID
  dealId: UUID
  taskType: string
  taskTitle: string
  taskComment?: string
  notifyMessage: string
}

export const createRequestTask =
  ({
    checklist,
    userId,
    dealId,
    taskTitle,
    taskComment,
    notifyMessage,
    taskType
  }: CreateRequestTask) =>
  async (dispatch, getState) => {
    let task: IDealTask | null

    const { deals } = getState() as IAppState

    const tasks: IDealTask[] = selectChecklistTasks(checklist, deals.tasks)

    const maxOrder = tasks.reduce(
      (max, task) => (task.order > max ? task.order : max),
      0
    )

    try {
      task = await dispatch(
        createTask({
          dealId,
          taskTitle,
          checklistId: checklist.id,
          taskType,
          form: undefined,
          order: maxOrder + 1
        })
      )
    } catch (e) {
      dispatch(
        notify({
          message: 'Could not finish the request. please try again.',
          status: 'error'
        })
      )

      return null
    }

    if (taskComment) {
      createTaskComment(task as IDealTask, userId, taskComment)
    }

    dispatch(changeNeedsAttention(dealId, task!.id, true))

    dispatch(
      notify({
        message: notifyMessage,
        status: 'success'
      })
    )

    return task
  }
