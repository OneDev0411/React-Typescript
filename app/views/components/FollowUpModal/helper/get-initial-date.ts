interface ReturnShape {
  todayTimestamp: number
  tomorrowTimestamp: number
  oneDayTimestamp: number
}

/**
 * return base date for follow up
 * @param initialDate
 */
export const getInitialDate = (initialDate: Date = new Date()): ReturnShape => {
  const oneDayTimestamp = 24 * 3600000
  const todayTimestamp = initialDate.getTime()
  const tomorrowTimestamp = todayTimestamp + oneDayTimestamp

  return { todayTimestamp, tomorrowTimestamp, oneDayTimestamp }
}
