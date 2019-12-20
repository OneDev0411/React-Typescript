import { addNotification as notify } from 'reapop'

import { voidEnvelope as voidEnvelopeDocument } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import { getTaskEnvelopes } from 'views/utils/deal-files/get-task-envelopes'

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

async function handleVoidEnvelope({ envelopes, task, deal }) {
  const envelopeDocuments = getTaskEnvelopes(envelopes, task)

  try {
    await store.dispatch(voidEnvelopeDocument(deal.id, envelopeDocuments[0].id))

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
