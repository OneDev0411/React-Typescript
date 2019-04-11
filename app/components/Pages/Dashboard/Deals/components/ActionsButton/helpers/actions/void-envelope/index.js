import { addNotification as notify } from 'reapop'

import { voidEnvelope } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

export function voidEnvelope(props) {
  store.dispatch(confirmation({
    message: 'Void Envelope?',
    confirmLabel: 'Yes, Void',
    onConfirm: () => voidEnvelope(props)
  }))
}


handleVoidEnvelope = async ({ envelopes, task, deal }) => {
  const envelopes = getTaskEnvelopes(envelopes, task)

  try {
    await store.dispatch(voidEnvelope(deal.id, envelopes[0].id))

    store.dispatch(notify({
      title: 'e-Signature is voided',
      status: 'success'
    }))
  } catch (e) {
    console.log(e)

    store.dispatch(notify({
      message: 'Can not void this eSign',
      status: 'error'
    }))
  }
}