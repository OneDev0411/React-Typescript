import { addNotification as notify } from 'reapop'

import { voidEnvelope as voidEnvelopeDocument } from 'actions/deals'
import { confirmation } from 'actions/confirmation'

import { getTaskEnvelopes } from '../../../../../utils/get-task-envelopes'

import store from '../../../../../../../../../stores'

export function voidEnvelope(props) {
  store.dispatch(confirmation({
    message: 'Void Envelope?',
    confirmLabel: 'Yes, Void',
    onConfirm: () => handleVoidEnvelope(props)
  }))
}


async function handleVoidEnvelope({ envelopes, task, deal }) {
  const envelopeDocuments = getTaskEnvelopes(envelopes, task)

  try {
    await store.dispatch(voidEnvelopeDocument(deal.id, envelopeDocuments[0].id))

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