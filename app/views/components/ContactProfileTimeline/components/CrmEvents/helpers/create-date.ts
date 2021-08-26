export function createDueDate(date: Date | null = new Date()): Date {
  const now = new Date()
  const newDate = new Date(date as Date)

  newDate.setHours(now.getHours())
  newDate.setMinutes(now.getMinutes())
  newDate.setSeconds(now.getSeconds())

  return newDate
}
