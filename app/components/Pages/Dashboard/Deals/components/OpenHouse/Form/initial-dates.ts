const now = new Date()
const startHour = 10 // AM
const endHour = 12 // PM
const setHours = hour => new Date(now.setHours(hour, 0, 0, 0))

const INITIAL_START_DATE = setHours(startHour)
const INITIAL_END_DATE = setHours(endHour)

export { INITIAL_START_DATE, INITIAL_END_DATE }
