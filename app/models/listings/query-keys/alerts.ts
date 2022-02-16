const TYPE = 'listings_alerts'

export function feedByAlert(alertId: UUID, alertRoomId: UUID) {
  return [TYPE, 'get_feed', alertId, alertRoomId]
}
