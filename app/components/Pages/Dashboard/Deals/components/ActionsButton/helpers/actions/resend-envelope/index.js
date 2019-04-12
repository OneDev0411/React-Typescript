import { addNotification as notify } from 'reapop'

import { confirmation } from 'actions/confirmation'
import { resendEnvelope as resendEnvelopeDocument } from 'models/Deal/envelope'

import { getTaskEnvelopes } from '../../../../../utils/get-task-envelopes'

import store from '../../../../../../../../../stores'

export function resendEnvelope(props) {
  store.dispatch(
    confirmation({
      message: 'Resend Envelope?',
      confirmLabel: 'Resend',
      onConfirm: () => handleResendEnvelope(props)
    })
  )
}

async function handleResendEnvelope(props) {
  const envelopes = getTaskEnvelopes(props.envelopes, props.task)

  try {
    await resendEnvelopeDocument(envelopes[0].id)

    store.dispatch(
      notify({
        title: 'The e-signature is resent',
        status: 'success'
      })
    )
  } catch (e) {
    console.log(e)

    store.dispatch(
      notify({
        title: 'Could not resend the e-signature. try again.',
        status: 'error'
      })
    )
  }
}
