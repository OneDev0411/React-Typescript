const setHours = hour => new Date(new Date().setHours(hour))

const INITIAL_START_DATE = setHours(10)
const INITIAL_END_DATE = setHours(12)

export { INITIAL_START_DATE, INITIAL_END_DATE }
