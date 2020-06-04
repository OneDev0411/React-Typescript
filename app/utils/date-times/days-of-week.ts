export function getDaysOfWeek(date: Date): Date[] {
  const firstDayOfWeek = date.getDate() - date.getDay()

  return new Array(7).fill(null).map((_, index) => {
    const weekDay = new Date(date)

    weekDay.setDate(firstDayOfWeek + index)

    return weekDay
  })
}