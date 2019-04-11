import { changeNeedsAttention, changeTaskStatus } from 'actions/deals'

import store from '../../../../../../../../../stores'

export async function approveTask(props) {
  await store.dispatch(changeTaskStatus(props.task.id, 'Approved'))
  store.dispatch(changeNeedsAttention(props.deal.id, props.task.id, false))
}
