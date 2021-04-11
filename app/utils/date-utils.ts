export function getWeekdayName(date: Date = new Date()): Weekday {
  return date.toLocaleDateString('en-US', {
    weekday: 'long'
  }) as Weekday;
}

export function getMonthName(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    month: 'short'
  });
}

export function getDayNumber(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    day: 'numeric'
  });
}

export function getDaysBetween(start: Date, end: Date): Date[] {
  const days: Date[] = []

  let date = new Date(start)
  date.setHours(0, 0, 0, 0)

  for (date; date <= end; date.setDate(date.getDate() + 1)) {
    days.push(new Date(date));
  }

  return days;
}

export function datesAreOnSameDay(first: Date, second: Date): boolean {
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate()
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return datesAreOnSameDay(today, date)
}

export function getSecondsSinceStartOfDay(date: Date = new Date()): number {
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diff = date.getTime() - today.getTime(); // ms difference
  return Math.round(diff / 1000); // make seconds
}
