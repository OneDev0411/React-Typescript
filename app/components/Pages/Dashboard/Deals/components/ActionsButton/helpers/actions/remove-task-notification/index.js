import store from 'store'

import { changeNeedsAttention, changeTaskStatus } from 'actions/deals'

export async function removeTaskNotification(props) {
  await store.dispatch(changeTaskStatus(props.task.id, 'Incomplete'))
  await store.dispatch(
    changeNeedsAttention(props.deal.id, props.task.id, false)
  )
}
