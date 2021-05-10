function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function getDefaultShowingStartDate() {
  return formatDateForInput(new Date())
}

export function getDefaultShowingEndDate(date: Date, dayCount: number) {
  if (dayCount) {
    date.setDate(date.getDate() + dayCount)
  }

  return formatDateForInput(date)
}
