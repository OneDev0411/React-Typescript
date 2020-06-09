import { getEnvelopeEditLink } from 'models/Deal/helpers/get-envelope-edit-link'

export function reviewEnvelope(props) {
  const link = getEnvelopeEditLink(props.envelope.id, props.user.access_token)

  window.open(link, '_blank')
}
