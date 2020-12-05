import { addNotification as notify } from 'components/notification'

import { voidEnvelope as voidEnvelopeDocument } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

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
        title: 'e-Signature is voided',
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
