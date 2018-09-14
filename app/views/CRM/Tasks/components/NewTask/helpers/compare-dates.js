export function setZeroSecondsAndMilliseconds(date) {
  const _date = new Date(date)

  _date.setSeconds(0)
  _date.setMilliseconds(0)

  return _date.getTime()
}

export function compareDates(dateOne, dateTwo) {
  const dateOneTimestamp = setZeroSecondsAndMilliseconds(dateOne)
  const dateTwoTimestamp = setZeroSecondsAndMilliseconds(dateTwo)

  if (dateOneTimestamp === dateTwoTimestamp) {
    return 0
  }

  if (dateOneTimestamp < dateTwoTimestamp) {
    return -1
  }

  return 1
}
