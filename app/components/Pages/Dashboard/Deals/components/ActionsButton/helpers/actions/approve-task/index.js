import store from 'store'

import { changeNeedsAttention, changeTaskStatus } from 'actions/deals'

export async function approveTask(props) {
  await store.dispatch(changeTaskStatus(props.task.id, 'Approved'))
  store.dispatch(changeNeedsAttention(props.deal.id, props.task.id, false))
}
