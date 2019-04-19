import { changeNeedsAttention, changeTaskStatus } from 'actions/deals'

import store from '../../../../../../../../../stores'

export async function declineTask(props) {
  await store.dispatch(changeTaskStatus(props.task.id, 'Declined'))
  store.dispatch(changeNeedsAttention(props.deal.id, props.task.id, false))
}
