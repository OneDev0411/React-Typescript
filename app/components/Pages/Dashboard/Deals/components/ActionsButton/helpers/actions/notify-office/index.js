import { addNotification as notify } from 'components/notification'

import { changeNeedsAttention } from 'actions/deals'

import Message from '../../../../../../Chatroom/Util/message'
import store from '../../../../../../../../../stores'

export async function notifyOffice(props, comment) {
  if (comment) {
    // send message
    Message.postTaskComment(props.task, {
      comment,
      author: props.user.id,
      room: props.task.room.id
    })
  }

  await store.dispatch(changeNeedsAttention(props.deal.id, props.task.id, true))

  store.dispatch(
    notify({
      message: 'Admin notification is sent.',
      status: 'success'
    })
  )
}
