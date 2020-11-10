import config from 'config'

export function getEnvelopeEditLink(envelope_id, token) {
  return `${config.app.url}/api/deals/envelope/${envelope_id}/edit?access_token=${token}`
}
