import { confirmation } from 'actions/confirmation'

import { notifyOffice } from '../notify-office'
import store from '../../../../../../../../../stores'

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
