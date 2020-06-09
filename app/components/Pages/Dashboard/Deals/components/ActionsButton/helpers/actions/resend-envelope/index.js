import { addNotification as notify } from 'reapop'

import { confirmation } from 'actions/confirmation'
import { resendEnvelope as resendEnvelopeDocument } from 'models/Deal/envelope'

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
  try {
    await resendEnvelopeDocument(props.envelope.id)

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
