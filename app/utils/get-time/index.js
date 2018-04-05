export const getTime = timestamp => {
  if (!timestamp || Number.isNaN(timestamp)) {
    throw new Error('Invalid timestamp')
  }

  const date = new Date(timestamp)
  const hours = date.getHours()
  const minutes = date.getMinutes()

  return hours * 3600 + minutes * 60
}
