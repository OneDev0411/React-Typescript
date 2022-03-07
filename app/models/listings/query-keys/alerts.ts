export function feedByAlert(alertId: UUID, alertRoomId: UUID) {
  return ['room', alertRoomId, 'recommendations', { alertId }]
}
