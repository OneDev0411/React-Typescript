export interface GetInitialDateReturn {
  baseDate: number
  tomorrow: number
  nextWeek: number
  oneDayTimestamp: number
  oneHourTimestamp: number
}

/**
 * return base date for follow up
 * @param initialDate
 */
export const getInitialDate = (
  initialDate: Date = new Date()
): GetInitialDateReturn => {
  const oneHourTimestamp = 3600000
  const oneDayTimestamp = 24 * oneHourTimestamp
  const baseDate = initialDate.getTime()
  const tomorrow = baseDate + oneDayTimestamp
  const nextWeek = baseDate + 7 * oneDayTimestamp

  return { baseDate, tomorrow, nextWeek, oneHourTimestamp, oneDayTimestamp }
}
