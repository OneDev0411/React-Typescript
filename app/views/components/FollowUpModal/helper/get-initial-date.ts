export interface GetInitialDateReturn {
  baseDate: number
  tomorrow: number
  nextWeek: number
  oneDayTimestamp: number
}

/**
 * return base date for follow up
 * @param initialDate
 */
export const getInitialDate = (
  initialDate: Date = new Date()
): GetInitialDateReturn => {
  const oneDayTimestamp = 24 * 3600000
  const baseDate = initialDate.getTime()
  const tomorrow = baseDate + oneDayTimestamp
  const nextWeek = baseDate + 7 * oneDayTimestamp

  return { baseDate, tomorrow, nextWeek, oneDayTimestamp }
}
