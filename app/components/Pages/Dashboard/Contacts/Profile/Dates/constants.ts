const currentYear = new Date().getFullYear()
const toTimestamp = (date: Date) => date.getTime() / 1000

export const START_DATE: number = toTimestamp(new Date(`${currentYear}-01-01`))
export const END_DATE: number = toTimestamp(new Date(`${currentYear}-12-31`))
