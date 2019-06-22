import { changeNeedsAttention, changeTaskStatus } from 'actions/deals'

import store from '../../../../../../../../../stores'

export async function removeTaskNotification(props) {
  await store.dispatch(changeTaskStatus(props.task.id, 'Incomplete'))
  await store.dispatch(
    changeNeedsAttention(props.deal.id, props.task.id, false)
  )
}
