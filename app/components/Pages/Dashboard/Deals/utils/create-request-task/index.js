import { addNotification as notify } from 'reapop'

import { createTask, changeNeedsAttention } from 'actions/deals'

import store from '../../../../../../stores'
import Message from '../../../Chatroom/Util/message'

export async function createRequestTask({
  checklist,
  userId,
  dealId,
  taskTitle,
  taskComment,
  notifyMessage,
  taskType
}) {
  let task

  try {
    task = await store.dispatch(
      createTask({
        dealId,
        taskTitle,
        checklistId: checklist.id,
        taskType
      })
    )
  } catch (e) {
    store.dispatch(
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
    room: task.room.id
  }

  // send comment message
  Message.postTaskComment(task, message)

  store.dispatch(changeNeedsAttention(dealId, task.id, true))

  store.dispatch(
    notify({
      message: notifyMessage,
      status: 'success',
      dismissible: true,
      dismissAfter: 4000
    })
  )

  return task
}
