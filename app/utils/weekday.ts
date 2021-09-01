/**
 * Get the full name of the week day and returns the day index
 * @param day a week day
 * @returns the index of week day
 */
export function getIndexOfWeekday(day: Weekday): number {
  return [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ].indexOf(day)
}
