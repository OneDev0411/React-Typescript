import { confirmation } from 'actions/confirmation'
import { voidEnvelope as voidEnvelopeDocument } from 'actions/deals'
import { addNotification as notify } from 'components/notification'

import store from '../../../../../../../../../stores'

export function voidEnvelope(props) {
  store.dispatch(
    confirmation({
      message: 'Void Envelope?',
      confirmLabel: 'Yes, Void',
      onConfirm: () => handleVoidEnvelope(props)
    })
  )
}

async function handleVoidEnvelope({ envelope, deal }) {
  try {
    await store.dispatch(voidEnvelopeDocument(deal.id, envelope.id))

    store.dispatch(
      notify({
        message: 'e-Signature is voided',
        status: 'success'
      })
    )
  } catch (e) {
    console.log(e)

    store.dispatch(
      notify({
        message: 'Could not void the e-Signature. Please try again.',
        status: 'error'
      })
    )
  }
}
