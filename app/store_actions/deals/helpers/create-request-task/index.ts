import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { addNotification as notify } from 'reapop'

import { createTask, changeNeedsAttention } from 'actions/deals'

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

export const createRequestTask = ({
  checklist,
  userId,
  dealId,
  taskTitle,
  taskComment,
  notifyMessage,
  taskType
}: CreateRequestTask) => async (
  dispatch: ThunkDispatch<any, any, AnyAction>
) => {
  let task: IDealTask | null

  try {
    task = await dispatch(
      createTask({
        dealId,
        taskTitle,
        checklistId: checklist.id,
        taskType
      })
    )
  } catch (e) {
    dispatch(
      notify({
        message: 'Could not finish the request. please try again.',
        status: 'error',
        dismissible: true,
        dismissAfter: 3000
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
      status: 'success',
      dismissible: true,
      dismissAfter: 4000
    })
  )

  return task
}
