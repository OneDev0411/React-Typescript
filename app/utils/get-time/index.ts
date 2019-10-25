type ReturnType = 'string' | 'number'

export function getTime(
  date: Date, 
  returnType: ReturnType = 'number'
): string | number {
  let hours: number = date.getHours()
  let minutes: number | string = date.getMinutes()

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
