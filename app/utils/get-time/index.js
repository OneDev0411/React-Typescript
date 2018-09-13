export const getTime = (timestamp, returnType = 'number') => {
  if (!timestamp || Number.isNaN(timestamp)) {
    throw new Error('Invalid timestamp')
  }

  const date = new Date(timestamp)
  const hours = date.getHours()
  const minutes = date.getMinutes()

  if (returnType === 'string') {
    return `${hours}:${minutes}`
  }

  return hours * 3600 + minutes * 60
}
