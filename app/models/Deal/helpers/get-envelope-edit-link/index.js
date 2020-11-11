export function getEnvelopeEditLink(envelope_id, token) {
  return `/api/deals/envelope/${envelope_id}/edit?access_token=${token}`
}
