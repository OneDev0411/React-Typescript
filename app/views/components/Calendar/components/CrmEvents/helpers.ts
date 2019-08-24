export function createDueDate(date: Date): Date {
  const now = new Date()
  const newDate = new Date(date)

  newDate.setHours(now.getHours())
  newDate.setMinutes(now.getMinutes())

  return newDate
}
