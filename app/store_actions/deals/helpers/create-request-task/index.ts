import { addNotification as notify } from 'components/notification'

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
}: CreateRequestTask) => async dispatch => {
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
