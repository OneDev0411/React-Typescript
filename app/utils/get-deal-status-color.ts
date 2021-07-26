export function getDealStatusColor(status: IDealStatus) {
  if (status.is_active) {
    return '#00FF00' // green
  }

  if (status.is_pending) {
    return '#FFA500' // orage
  }

  if (status.is_archived) {
    return '#808080' // grey
  }

  if (status.is_closed) {
    return '#FF0000' // red
  }

  return '#FFF'
}
