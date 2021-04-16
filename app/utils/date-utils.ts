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
  const startOfThatDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diff = date.getTime() - startOfThatDay.getTime(); // ms difference
  return Math.floor(diff / 1000); // make seconds
}


/**
 * returns true if the target date is after the origin date
 * with optionally passed distance in seconds
 */
export function hasDistance(target: Date, origin: Date, distanceSeconds: number = 0): boolean {
  const targetSeconds = Math.floor(target.getTime() / 1000)
  const originSeconds = Math.floor(origin.getTime() / 1000)

  return originSeconds + distanceSeconds < targetSeconds
}
