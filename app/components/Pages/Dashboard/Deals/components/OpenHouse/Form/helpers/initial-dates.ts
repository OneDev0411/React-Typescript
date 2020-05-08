const now = new Date()
const setHours = hour => new Date(now.setHours(hour, 0, 0, 0))

const INITIAL_START_DATE = setHours(10)
const INITIAL_END_DATE = setHours(12)

export { INITIAL_START_DATE, INITIAL_END_DATE }
