import { changeNeedsAttention } from 'actions/deals'

import store from '../../../../../../../../../stores'

export async function removeTaskNotification(props) {
  store.dispatch(changeNeedsAttention(props.deal.id, props.task.id, false))
}
