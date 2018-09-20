export const getTime = (date, returnType = 'number') => {
  let hours = date.getHours()
  let minutes = date.getMinutes()

  if (returnType === 'string') {
    if (hours > 12) {
      hours -= 12
    } else if (hours == 0) {
      hours = 12
    }

    if (minutes < 10) {
      minutes = `0${minutes}`
    }

    return `${hours}:${minutes}`
  }

  return hours * 3600 + minutes * 60
}
