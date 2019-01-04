export function getEnvelopeSignLink(envelope_id, recipient_id, token) {
  return `/api/deals/envelope/${envelope_id}/sign/${recipient_id}?access_token=${token}`
}
