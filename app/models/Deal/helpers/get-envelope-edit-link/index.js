import config from 'config'

export function getEnvelopeEditLink(envelope_id, token) {
  return `${config.proxy.url}/api/deals/envelope/${envelope_id}/edit?access_token=${token}`
}
