import { confirmation } from 'actions/confirmation'

import store from '../../../../../../../../../stores'
import { notifyOffice } from '../notify-office'

export async function createNeedsAttention(props) {
  store.dispatch(
    confirmation({
      message: 'Notify Office?',
      confirmLabel: 'Notify Office',
      needsUserEntry: true,
      inputDefaultValue: '',
      onConfirm: comment => notifyOffice(props, comment)
    })
  )
}
