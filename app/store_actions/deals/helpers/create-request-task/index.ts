import { addNotification as notify } from 'reapop'

import { createTask, changeNeedsAttention } from 'actions/deals'

import Message from '../../../../components/Pages/Dashboard/Chatroom/Util/message'

export function createRequestTask({
  checklist,
  userId,
  dealId,
  taskTitle,
  taskComment,
  notifyMessage,
  taskType
}) {
  return async dispatch => {
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

    const message = {
      comment: taskComment,
      author: userId,
      room: task!.room.id
    }

    // send comment message
    Message.postTaskComment(task, message)

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
}
