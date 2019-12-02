import { getEnvelopeEditLink } from 'models/Deal/helpers/get-envelope-edit-link'

import { getDocumentEnvelopes } from 'views/utils/deal-files/get-document-envelopes'
import { getTaskEnvelopes } from 'views/utils/deal-files/get-task-envelopes'

export function reviewEnvelope(props) {
  let envelopes = []

  if (props.type === 'task') {
    envelopes = getTaskEnvelopes(props.envelopes, props.task)
  }

  if (props.type === 'document') {
    envelopes = getDocumentEnvelopes(props.envelopes, props.document)
  }

  if (envelopes.length === 0) {
    return false
  }

  const link = getEnvelopeEditLink(envelopes[0].id, props.user.access_token)

  window.open(link, '_blank')
}
