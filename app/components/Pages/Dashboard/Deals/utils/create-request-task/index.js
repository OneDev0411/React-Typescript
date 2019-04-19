import { addNotification as notify } from 'reapop'

import { createGenericTask, changeNeedsAttention } from 'actions/deals'

import store from '../../../../../../stores'
import Message from '../../../Chatroom/Util/message'

export async function createAdminRequestTask({
  checklist,
  userId,
  dealId,
  taskTitle,
  taskComment,
  notifyMessage
}) {
  const task = await store.dispatch(
    createGenericTask(dealId, taskTitle, checklist.id)
  )

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
}
